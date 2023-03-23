import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { B2bService } from '../../services/b2b.service';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-save-company-modal',
  templateUrl: './save-company-modal.component.html',
  styleUrls: ['./save-company-modal.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    ),
    trigger(
      'leaveAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(0)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(100%)', opacity: 1 }))
      ]),
    ]
    )
  ],
})
export class SaveCompanyModalComponent implements OnInit {
  @Input() title: string = "Save";
  @Input() selectedItems: Array<any> = [];
  @Output() successfullyAdded = new EventEmitter();
  showCreateNew: boolean = false;
  listName: string = "";
  apacList: Array<any> = [];
  subscription: Subscription;
  selectedList: any = null;

  constructor(private b2bService: B2bService,
    private dataService: DataService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // this.getApacList();
    this.subscription = this.dataService.apacListSubscriber.subscribe(data => {
      this.apacList = data;
    });
  }

  handleCreateNewPress(event) {
    event.stopPropagation();
    this.showCreateNew = !this.showCreateNew;
    // console.log(this.showCreateNew)
  }

  createB2bApackList(event) {
    event.stopPropagation();
    if (this.listName != "") {
      const body = { listName: this.listName, autoCreated: false, listType: "B2B" };
      this.b2bService.createB2bList(body).subscribe((res) => {
        this.showCreateNew = false;
        this.messageService.display(true, "Successfully created the list");
        this.getApacList();
      });
    }
  }

  addCompanyToList(event) {
    // console.log(this.selectedItems, "this.selectedItems")
    if (this.selectedItems.length > 0 && this.selectedList != null) {
      const body = {
        listId: this.selectedList.listId,
        companyIdList: this.selectedItems
      }
      // console.log(body);
      this.b2bService.addContactToB2bApac(body).subscribe(res => {
        this.messageService.display(true, "Successfully added to the list");
        this.selectedList = null;
        this.successfullyAdded.emit();
      },
      error => {
        if(error.error) {
          const msg: any = error.error[0].message?error.error[0].message:'Error';
          this.messageService.displayError(true,msg)
        }
      });
    }
  }

  getApacList() {
    this.b2bService.getB2bApacList(0, 1000).subscribe(res => {
      // console.log(res)
      this.dataService.changeApacList(res.savedlistInfoList);
    });
  }

  ngOnDestroy() {

  }
}
