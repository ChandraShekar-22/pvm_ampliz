import { animate, style, transition, trigger } from "@angular/animations";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { Subscription } from "rxjs";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { Contact } from "../../models/ContactsModel";
import { B2bService } from "../../services/b2b.service";
import { DataService } from "../../services/data.service";
import { MessageService } from "../../services/message.service";
@Component({
  selector: "app-save-contact-modal",
  templateUrl: "./save-contact-modal.component.html",
  styleUrls: ["./save-contact-modal.component.css"],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate("300ms", style({ transform: "translateX(0)", opacity: 1 })),
      ]),
    ]),
    trigger("leaveAnimation", [
      transition(":enter", [
        style({ transform: "translateX(0)", opacity: 0 }),
        animate("300ms", style({ transform: "translateX(100%)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class SaveContactModalComponent implements OnInit, OnDestroy {
  @Input() title: string = "Save";
  @Input() isSaveButton: boolean = true;
  @Input() fromCard: boolean = false;
  @Input() selectedItems: Array<any> = [];
  // @Input() showBulkSave: boolean = true;
  // @Input() singleSave: boolean = true;
  @Output() successfullyAdded = new EventEmitter();
  @Output() contactViewed = new EventEmitter();
  @Input() allContactsSelected = false;
  @Input() selectedFilter: any = {};

  showCreateNew: boolean = false;
  listName: string = "";
  apacList: Array<any> = [];
  subscription: Subscription;
  loading: boolean = false;
  public selectedList: any = null;
  // bulkSaveEnabled: boolean = false;
  @Input() totalItemCount: number = 5000;
  @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;

  // @ViewChild('contactInput', { static: false }) contactInput: ElementRef;

  listGroupContact = new UntypedFormGroup({
    select: new UntypedFormControl(null, Validators.required),
  });

  listNameGroup = new UntypedFormGroup({
    listName: new UntypedFormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });
  @ViewChild("f") myNgForm;

  constructor(
    private b2bService: B2bService,
    private dataService: DataService,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    // this.getApacList();
    this.subscription = this.dataService.apacListSubscriber.subscribe(
      (data) => {
        this.apacList = data;
      }
    );
  }

  handleCreateNewPress(event) {
    event.stopPropagation();
    this.showCreateNew = !this.showCreateNew;
    this.listNameGroup.reset();
  }

  createB2bApackList(event) {
    const listName = this.listNameGroup.value.listName;
    event.stopPropagation();
    if (this.listNameGroup.valid) {
      this.loaderService.display(true);
      const body = { listName: listName, autoCreated: false, listType: "B2B" };
      this.b2bService.createB2bList(body).subscribe(
        (res) => {
          this.loaderService.display(false);
          this.showCreateNew = false;
          this.messageService.display(
            true,
            "Successfully created the list",
            "Saved Successfully"
          );
          this.getApacList();
        },
        (error) => {
          this.loaderService.display(false);
        }
      );
    }
  }

  handleSavePress(event) {
    event.stopPropagation();
    if (this.listGroupContact.valid == true) {
      if (this.allContactsSelected) {
        this.bulkSave();
      } else {
        if (this.fromCard == true) {
          this.saveViewedContact();
        } else {
          this.addContactToList();
        }
      }
    }
  }

  bulkSave() {
    this.loaderService.display(true);
    const selectedList = this.listGroupContact.value.select || {};
    const body = {
      listId: selectedList.listId,
      recordCount: this.totalItemCount,
      searchInputContact: this.selectedFilter,
    };
    this.b2bService.savePeopleAsPerCount(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.messageService.display(true, "Successfully added to the list");
        this.listGroupContact.reset();
        this.successfullyAdded.emit();
        this.menuTrigger.closeMenu();
      },
      (error) => {
        this.loaderService.display(false);
        this.menuTrigger.closeMenu();
      }
    );
  }

  addContactToList() {
    this.loaderService.display(true);
    const selectedList = this.listGroupContact.value.select || {};
    if (this.selectedItems.length > 0) {
      const body = {
        listId: selectedList.listId,
        contactIdList: this.selectedItems,
      };
      // console.log(body);
      this.b2bService.addContactToB2bApac(body).subscribe(
        (res) => {
          let savedContacts: Array<Contact> = res.contactList;
          this.dataService.addToSavedContacts(savedContacts);
          this.loaderService.display(false);
          this.messageService.display(true, "Successfully added to the list");
          this.listGroupContact.reset();
          this.successfullyAdded.emit();
          this.menuTrigger.closeMenu();
        },
        (error) => {
          this.loaderService.display(false);
          this.menuTrigger.closeMenu();
        }
      );
    }
  }

  getApacList() {
    this.b2bService.getB2bApacList(0, 1000).subscribe((res) => {
      // console.log(res)
      this.dataService.changeApacList(res.savedlistInfoList);
    });
  }

  ngOnDestroy() {}

  // bulkUploadDataChanged(event) {
  //   if (this.selectedItems.length > 0) {
  //     this.bulkSaveEnabled = !this.bulkSaveEnabled;
  //     this.focusContactInput();
  //   }
  // }

  // focusContactInput() {
  //   setTimeout(() => {
  //     if (this.contactInput) {
  //       this.contactInput.nativeElement.focus();
  //     }
  //   }, 100);
  // }
  // handleSaveTrigger() {
  //   if (this.selectedItems.length == 0) {
  //     this.bulkSaveEnabled = true;
  //     this.focusContactInput();
  //   } else {
  //     this.bulkSaveEnabled = false;
  //   }
  // }

  handleSaveTrigger() {
    this.listGroupContact.reset();
    this.myNgForm.resetForm();
  }

  viewContact() {
    const body = {
      contactId: this.selectedItems[0],
    };
    this.loaderService.display(true);
    this.b2bService.viewContactFromList(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.messageService.display(true, "Successfully added to the list");
        let savedContact: Contact = res.contactInfo;
        this.dataService.addToSavedContacts([savedContact]);
        this.successfullyAdded.emit();
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  viewSingleContact() {
    const body = {
      contactId: this.selectedItems[0],
    };
    // this.loaderService.display(true);
    this.loading = true;
    // let flag = false;
    this.b2bService.viewContact(body).subscribe(
      (res) => {
        // this.loaderService.display(false);
        // flag = true;
        this.loading = false;
        if (res.errorMsg.length > 0) {
          this.messageService.displayError(true, res.errorMsg);
        }
        // this.messageService.display(true, "Successfully added to the list");
        this.dataService.refreshHeader(); // Calling checkSubscription method to get the updated daily credit
        let savedContact: any = res;
        this.dataService.addToSavedContacts([savedContact]); //Need to comment it
        this.contactViewed.emit(res);
      },
      (err) => {
        // this.loaderService.display(false);
        this.loading = false;
      }
    );
  }

  // viewSingleContact() {
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(function () {
  //       reject();
  //     }, 30000);
  //     const body = {
  //       contactId: this.selectedItems[0],
  //     };
  //     this.loading = true;
  //     let flag = false;
  //     this.b2bService.viewContact(body).subscribe(
  //       (res) => {
  //         // this.loaderService.display(false);
  //         flag = true;
  //         this.loading = false;
  //         if (res.errorMsg.length > 0) {
  //           this.messageService.displayError(true, res.errorMsg);
  //         }
  //         // this.messageService.display(true, "Successfully added to the list");
  //         this.dataService.getCheckSubscriptionData(); // Calling checkSubscription method to get the updated daily credit
  //         let savedContact: any = res;
  //         this.dataService.addToSavedContacts([savedContact]); //Need to comment it
  //         this.contactViewed.emit(res);
  //       },
  //       (err) => {
  //         // this.loaderService.display(false);
  //         this.loading = false;
  //       }
  //     );
  //   });
  // }

  // apiWithTimeout() {
  //   this.viewSingleContact.then(res => {})
  // }

  saveViewedContact() {
    const selectedList = this.listGroupContact.value.select || {};
    const body = {
      listId: selectedList.listId,
      contactId: this.selectedItems[0],
    };
    this.b2bService.saveViewedContact(body).subscribe(
      (res) => {
        this.messageService.display(true, "Successfully added to the list");
        let savedContact: Contact = res.contactInfo;
        this.dataService.addToSavedContacts([savedContact]);
        // this.successfullyAdded.emit(savedContact);
        this.successfullyAdded.emit(savedContact);
      },
      (err) => {}
    );
  }
}
