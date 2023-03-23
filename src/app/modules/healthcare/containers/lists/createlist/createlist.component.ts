import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";

@Component({
  selector: "app-createlist",
  templateUrl: "./createlist.component.html",
  styleUrls: ["./createlist.component.css"],
})
export class CreatelistComponent implements OnInit {
  @Input() createListDiv: boolean = true;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  success: EventEmitter<boolean> = new EventEmitter<boolean>();

  sideNav: boolean = false;
  createListForm: UntypedFormGroup;
  formSubmitAttempt: boolean;
  userId: string = localStorage.getItem("auth_token");
  constructor(
    private fb: UntypedFormBuilder,
    public amplizService: AmplizService,
    private messageService: MessageService
  ) {
    this.createListForm = fb.group({
      listName: ["", [Validators.required]],
    });
  }

  ngOnInit() {}

  cancelCreateDiv() {
    this.sideNav = true;
    this.cancelBtnClick.emit(false);
    this.createListForm.reset();
  }

  createList() {
    this.formSubmitAttempt = true;
    var listName = this.createListForm.value.listName;

    if (this.createListForm.valid) {
      this.amplizService
        .createList(this.createListForm.value.listName)
        .subscribe(
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
            this.messageService.displayError(true, error.error[0].message);
          }
        );
    }
  }
}
