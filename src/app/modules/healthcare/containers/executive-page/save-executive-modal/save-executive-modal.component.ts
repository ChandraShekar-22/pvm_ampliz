import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { SkeletonloaderService } from 'src/app/modules/healthcare/services/skeletonloader.service';


@Component({
  selector: 'app-save-executive-modal',
  templateUrl: './save-executive-modal.component.html',
  styleUrls: ['./save-executive-modal.component.css'],
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
export class SaveExecutiveModalComponent implements OnInit {
  @Input() title: string = "Save";
  @Input() selectedItems: Array<any> = [];
  @Input() filterParams: any = {};
  @Output() successfullyAdded = new EventEmitter();
  showCreateNew: boolean = false;
  apacList: Array<any> = [];
  subscription: Subscription;
  updatedCredits: any = localStorage.getItem("credits");
  bulkSaveEnabled: boolean = false;
  numberOfExecutives: number = 5;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('physicianInput') executiveInput: ElementRef;

  listGroup = new UntypedFormGroup({
    select: new UntypedFormControl(null, Validators.required),
  });

  listNameGroup = new UntypedFormGroup({
    listName: new UntypedFormControl(null,[Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private amplizService: AmplizService,
    private ngZone: NgZone,
    public router: Router,
    public loaderService: SkeletonloaderService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getAllList();
    this.getDashboardDetails();
    // this.subscription = this.dataService.apacListSubscriber.subscribe(data => {
    //   this.apacList = data;
    // });
  }
  getAllList() {
    this.amplizService.getAllList(0, 1000,false).subscribe(res => {
      this.apacList = res.savedlistInfoList;
    },
      err => {

      });
  }


  async getDashboardDetails() {
    this.amplizService.getDashboardDetails().subscribe(
      (res) => {
        this.updatedCredits = res.CurrentCredits;
      },
      (error) => {
      }
    );
  }


  handleCreateNewPress(event) {
    event.stopPropagation();
    this.showCreateNew = !this.showCreateNew;
    this.listNameGroup.reset();
    // console.log(this.showCreateNew)
  }

  createB2bApackList(event) {
    event.stopPropagation();
    const listName = this.listNameGroup.value.listName;
    if (this.listNameGroup.valid) {
      
      this.amplizService.createList(listName).subscribe(res => {
        this.showCreateNew = false;
        this.messageService.display(true, "Successfully created the list");
        this.getAllList();
      },error => {
        let msg: any = 'Error';
        if (error.error) {
          msg = error.error[0].message ? error.error[0].message : 'Error';
        }
        this.messageService.displayError(true, msg);
      });
    }
  }

  addExecutiveToList() {
    // console.log(this.selectedItems, "this.selectedItems")
    if (this.listGroup.valid ==true) {
      this.menuTrigger.closeMenu();
      const selectedList = this.listGroup.value.select || {};
      const body = {
        listid: selectedList.listId,
        leadIdList: this.selectedItems,
        leadType: "HealthExecutive"
      }
      this.loaderService.display(true);
      this.amplizService.addLeadsToList(body).subscribe(res => {
        this.loaderService.display(false);
        this.messageService.display(true, "Successfully added to the list");
        this.listGroup.reset();
        this.successfullyAdded.emit();
      },
        error => {
          this.loaderService.display(false);
          if (error.error) {
            const msg: any = error.error[0].message ? error.error[0].message : 'Error';
            this.messageService.displayError(true, msg)
          }
        });
    }
  }
  public openItem(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }


  handleSavePress(event) {
    event.stopPropagation();
    if (this.listGroup.valid ==true) {
      if (this.bulkSaveEnabled) {
        this.bulkSave();
      } else {
        this.addExecutiveToList();
      }
    }
  }


  bulkSave() {
    const selectedList = this.listGroup.value.select || {};
    if(this.numberOfExecutives>0) {
      this.menuTrigger.closeMenu();
    const body = {
      listId: selectedList.listId,
      recordCount: this.numberOfExecutives,
      searchInputExecutive: this.filterParams
    }
    this.loaderService.display(true);
    this.amplizService.saveExecutiveAsPerCount(body).subscribe(res => {
      this.messageService.display(true, "Successfully added to the list");
      this.listGroup.reset();
      this.successfullyAdded.emit();
      this.numberOfExecutives = 5;
      this.loaderService.display(false);
    },
      error => {
        this.loaderService.display(false);
        let msg: any = "Server Error";
        if (error.error[0]) {
          msg = error.error[0].message ? error.error[0].message : 'Error';
        }
        this.messageService.displayError(true, msg || "Error")
      });
    }
  }



  bulkUploadDataChanged(event) {
    if (this.selectedItems.length > 0) {
      this.bulkSaveEnabled = !this.bulkSaveEnabled;
      this.focusExecutiveInput();
    }
  }

  focusExecutiveInput() {
    setTimeout(() => {
      if (this.executiveInput) {
        this.executiveInput.nativeElement.focus();
      }
    }, 100);
  }
  handleSaveTrigger() {
    if (this.selectedItems.length == 0) {
      this.bulkSaveEnabled = true;
      this.focusExecutiveInput();
    } else {
      this.bulkSaveEnabled = false;
    }
  }

}
