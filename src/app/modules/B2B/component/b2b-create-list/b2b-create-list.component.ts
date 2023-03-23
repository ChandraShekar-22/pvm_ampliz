import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { ErrorService } from 'src/app/modules/healthcare/services/error.service';
import { MessageService } from '../../services/message.service';
import { B2bService } from '../../services/b2b.service';


@Component({
  selector: 'app-b2b-create-list',
  templateUrl: './b2b-create-list.component.html',
  styleUrls: ['./b2b-create-list.component.css']
})
export class B2bCreateListComponent implements OnInit {

  @Input() createListDiv: boolean = true;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  success: EventEmitter<boolean> = new EventEmitter<boolean>();

  sideNav: boolean = false;
  createListForm: UntypedFormGroup;
  formSubmitAttempt: boolean;
  userId: string = localStorage.getItem('auth_token');
  constructor(private fb: UntypedFormBuilder,
    private errorService: ErrorService,
    private messageService: MessageService,
    private b2bService: B2bService
    ) {
    this.createListForm = fb.group({
      listName: ['', [Validators.required]],
    });
  }


  ngOnInit() {
  }
  cancelCreateDiv() {
    this.sideNav = true;
    this.cancelBtnClick.emit(false);
    this.createListForm.reset();
  }

  createList() {
    this.formSubmitAttempt = true;
    var listName = this.createListForm.value.listName;

    if (this.createListForm.valid) {
      const body = { listName: listName, autoCreated: false, listType: "B2B" };
      this.b2bService.createB2bList(body).subscribe(
        (data) => {
          this.messageService.display(
            true,
            this.createListForm.value.listName + " list created successfully!"
          );
          this.sideNav = true;
          this.cancelBtnClick.emit(false);
          this.success.emit(true);
          this.createListForm.reset();
        },
        (error) => {
          this.sideNav = true;
          this.cancelBtnClick.emit(false);
          this.createListForm.reset();
          this.errorService.display(true, error.error[0].message);
        }
      );
    }
  }
}
