import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { LTC } from '../../../models/LTCModel';
import { LTCDataService } from '../../../services/ltc-data.service';
import { LTCService } from '../../../services/ltc.service';

@Component({
  selector: 'app-save-ltc-modal',
  templateUrl: './save-ltc-modal.component.html',
  styleUrls: ['./save-ltc-modal.component.css'],
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
export class SaveLtcModalComponent implements OnInit {
  @Input() title: string = "Save";
  @Input() isSaveButton: boolean = true;
  @Input() fromCard: boolean = false;
  @Input() selectedItems: Array<any> = [];
  // @Input() showBulkSave: boolean = true;
  // @Input() singleSave: boolean = true;
  @Output() successfullyAdded = new EventEmitter();
  @Input() allContactsSelected = false;
  @Input() selectedFilter: any = {};

  showCreateNew: boolean = false;
  listName: string = "";
  apacList: Array<any> = [];
  subscription: Subscription;
  private selectedList: any = null;
  bulkSaveEnabled: boolean = false;
  bulkSaveCount: number = 5;
  @Input() totalItemCount: number = 5000;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('bulksaveInput') bulksaveInput: ElementRef;

  listGroupContact = new UntypedFormGroup({
    select: new UntypedFormControl(null, Validators.required),
  });


  listNameGroup = new UntypedFormGroup({
    listName: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
  });
  @ViewChild('f') myNgForm;



  constructor(
    private ltcService: LTCService,
    private dataService: LTCDataService,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private amplizService: AmplizService
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
    this.listNameGroup.reset();
  }

  createB2bApackList(event) {
    const listName = this.listNameGroup.value.listName;
    event.stopPropagation();
    if (this.listNameGroup.valid) {
      this.loaderService.display(true);
      const body = {
        listName: listName
      }
      this.ltcService.createList(body).subscribe(res => {
        this.loaderService.display(false);
        this.showCreateNew = false;
        this.messageService.display(true, "Successfully created the list", "Saved Successfully");
        this.getApacList();
      },
        error => {
          this.loaderService.display(false);
        }
      );
    }
  }

  handleSavePress(event) {
    event.stopPropagation();
    if (this.listGroupContact.valid == true) {
      if (this.bulkSaveEnabled) {
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
    if (this.bulkSaveCount > 0) {
      this.loaderService.display(true);
      const selectedList = this.listGroupContact.value.select || {};
      const body = {
        listId: selectedList.listId,
        recordCount: this.bulkSaveCount,
        searchInputLTC: this.selectedFilter
      }
      this.ltcService.saveLTCAsPerCount(body).subscribe(res => {
        this.loaderService.display(false);
        this.messageService.display(true, "Successfully added to the list");
        this.listGroupContact.reset();
        this.successfullyAdded.emit();
        this.menuTrigger.closeMenu();
      },
        error => {
          this.loaderService.display(false);
          this.menuTrigger.closeMenu();
        });
    }
  }

  addContactToList() {
    this.loaderService.display(true);
    const selectedList = this.listGroupContact.value.select || {};
    if (this.selectedItems.length > 0) {
      const body = {
        listid: selectedList.listId,
        leadIdList: this.selectedItems,
        leadType: "LTC"
      }
      this.amplizService.addLeadsToList(body).subscribe((res: any) => {
        this.loaderService.display(false);
        this.messageService.display(true, "Successfully added to the list");
        this.listGroupContact.reset();
        this.successfullyAdded.emit();
        this.menuTrigger.closeMenu();
      },
        error => {
          this.loaderService.display(false);
          this.menuTrigger.closeMenu();
        });
    }
  }

  getApacList() {
    this.ltcService.getLists(0, 1000).subscribe(res => {
      // console.log(res)
      this.dataService.changeApacList(res.savedlistInfoList);
    });
  }

  ngOnDestroy() {

  }

  bulkUploadDataChanged(event) {
    if (this.selectedItems.length > 0) {
      this.bulkSaveEnabled = !this.bulkSaveEnabled;
      this.focusContactInput();
    }
  }

  focusContactInput() {
    setTimeout(() => {
      if (this.bulksaveInput) {
        this.bulksaveInput.nativeElement.focus();
      }
    }, 100);
  }
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
      ltcExecutiveId: this.selectedItems[0]
    }
    this.loaderService.display(true);
    this.ltcService.viewLTCFromList(body).subscribe(res => {
      this.loaderService.display(false);
      // this.messageService.display(true, "Successfully added to the list");
      this.ltcService.getLTCCenterDetails(this.selectedItems[0]).subscribe(overview => {
        this.dataService.addToSavedLTC([overview.ltcInfo]);
      });
      this.successfullyAdded.emit();
    },
      err => {
        this.loaderService.display(false);
      });
  }

  saveViewedContact() {
    const selectedList = this.listGroupContact.value.select || {};
    this.loaderService.display(true);
    const body = {
      listId: selectedList.listId,
      leadId: this.selectedItems[0]
    }
    this.ltcService.saveViewedLTC(body).subscribe(res => {
      this.messageService.display(true, "Successfully added to the list");
      setTimeout(() => {
        this.loaderService.display(false);
        this.getLTCCenterDetails();
      }, 400);

      this.successfullyAdded.emit();
    },
      err => {
        this.loaderService.display(false);
      });
  }

  getLTCCenterDetails() {
    this.loaderService.display(true);
    this.ltcService.getLTCCenterDetails(this.selectedItems[0]).subscribe(overview => {
      this.loaderService.display(false);
      this.dataService.addToSavedLTC([overview.ltcInfo]);
    },
      err => {
        this.loaderService.display(false);
      });
  }

}
