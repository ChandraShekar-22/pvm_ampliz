import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  NgZone,
} from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { Router } from "@angular/router";
import { MessageService } from "src/app/modules/B2B/services/message.service";
@Component({
  selector: "app-savelist",
  templateUrl: "./savelist.component.html",
  styleUrls: ["./savelist.component.css"],
})
export class SavelistComponent implements OnInit {
  @Input() saveListDiv: boolean = true;
  @Input() physicianId: any;
  @Input() executiveId: any;
  @Input() currentCredit: any;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  refreshedData: EventEmitter<boolean> = new EventEmitter<boolean>();
  sideNav: boolean = false;
  selectListForm: UntypedFormGroup;
  formSubmitAttempt: boolean;
  userId: string = localStorage.getItem("auth_token");
  savedList: any;
  createDrawer: boolean = false;
  updatedCredits: any = localStorage.getItem("credits");
  isSpecialityUser: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    public amplizService: AmplizService,
    private ngZone: NgZone,
    public router: Router,
    private messageService: MessageService
  ) {
    this.selectListForm = fb.group({
      saveListName: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.getAllList();
    this.updateCreditScore();
    setTimeout(() => {
      this.isSpecialityUser =
        localStorage.getItem("is_SpecialityUser") == "true" ? true : false;
      // console.log(this.isSpecialityUser, "this.isSpecialityUser");
    }, 10);
  }

  getAllList() {
    this.amplizService.getAllList(0, 100000000,false).subscribe((res) => {
      this.savedList = res.savedlistInfoList;
    });
  }

  cancelClick(value: boolean) {
    this.createDrawer = value;
  }

  success(ev: any) {
    this.getAllList();
  }
  cancelSaveDiv() {
    setTimeout(() => {
      this.cancelBtnClick.emit(false);
    }, 1000);
    this.sideNav = true;
    this.saveListDiv = false;
    this.selectListForm.reset();
    this.updateCreditScore();
  }

  updateCreditScore() {
    this.amplizService.getDashboardDetails().subscribe((res) => {
      localStorage.setItem("credits", res.CurrentCredits);
      this.updatedCredits = res.CurrentCredits;
    });
  }
  public openItem(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  saveList() {
    this.formSubmitAttempt = true;
    var listId = this.selectListForm.value.saveListName;

    if (this.selectListForm.valid) {
      if (this.physicianId) {
        this.amplizService
          .saveViewedLeads(this.physicianId, listId)
          .subscribe(
            (res) => {
              this.sideNav = true;
              this.cancelBtnClick.emit(false);
              this.selectListForm.reset();
              this.refreshedData.emit(true);
              this.messageService.display(true, "Successfully saved");
              this.updateCreditScore();
            },
            (error) => {
              this.sideNav = true;
              this.cancelBtnClick.emit(false);
              this.selectListForm.reset();
              this.refreshedData.emit(true);
              this.messageService.displayError(true, error.error[0].message);
            }
          );
      } else {
        this.amplizService
          .saveViewedLeads(this.executiveId, listId)
          .subscribe(
            (res) => {
              this.sideNav = true;
              this.cancelBtnClick.emit(false);
              this.selectListForm.reset();
              this.refreshedData.emit(true);
              this.messageService.display(true, "Successfully saved");
              this.updateCreditScore();
            },
            (error) => {
              this.sideNav = true;
              this.cancelBtnClick.emit(false);
              this.selectListForm.reset();
              this.refreshedData.emit(true);
              this.messageService.displayError(true, error.error[0].message);
            }
          );
      }
    }
  }
}
