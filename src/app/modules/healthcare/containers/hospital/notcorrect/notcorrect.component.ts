import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";

@Component({
  selector: "app-hospital-notcorrect",
  templateUrl: "./notcorrect.component.html",
  styleUrls: ["./notcorrect.component.css"],
})
export class NotcorrectHospitalComponent implements OnChanges {
  @Input() notCorrectDiv: boolean = true;
  @Input() hospitalId: any;
  // @Input() physicianName: any;
  @Input() hospitalName: any;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  sideNav: boolean = false;
  notCorrectListForm: UntypedFormGroup;
  formSubmitAttempt: boolean;
  notCorrectList = [
    "Hospital Name",
    "Speciality",
    "Location",
    "No of Beds",
    "Phone Number",
    "Website",
  ];
  selectedIncorrectList: any = [];
  savedList: any;
  otherValInput: string = "";
  notcorrecrError: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    public amplizService: AmplizService,
    private messageService: MessageService
  ) {
    this.notCorrectListForm = fb.group({
      inCorrectListName: [""],
      otherVal: [""],
    });
  }

  addRemoveIncorrectData(ev: any) {
    var selctedVal = ev.target.value;
    var index = this.selectedIncorrectList.indexOf(selctedVal);
    if (index !== -1) {
      this.selectedIncorrectList.splice(index, 1);
    } else {
      this.selectedIncorrectList.push(selctedVal);
    }

    //
  }

  cancelSaveDiv() {
    this.sideNav = true;
    this.cancelBtnClick.emit(false);
  }

  ngOnChanges(changes: any) {}

  saveList() {
    this.formSubmitAttempt = true;

    var listId = this.notCorrectListForm.value.saveListName;

    if (this.otherValInput !== "") {
      this.selectedIncorrectList.push(this.otherValInput);
    }

    if (this.selectedIncorrectList.length > 0) {
      this.amplizService
        .reportIncorrectHospitalData(
          this.hospitalId,
          this.selectedIncorrectList
        )
        .subscribe(
          (res) => {
            this.sideNav = true;
            this.cancelBtnClick.emit(false);
            this.notCorrectListForm.reset();
            this.messageService.display(true, "Thank you for you feedback.");
            this.selectedIncorrectList = [];
            this.otherValInput = "";
          },
          (error) => {
            this.selectedIncorrectList = [];
            this.otherValInput = "";
            this.sideNav = true;
            this.cancelBtnClick.emit(false);
            this.notCorrectListForm.reset();
            let msg = "Error";
            if(error.error) {
              msg = error.error[0].message||"Error";
            }
            this.messageService.displayError(true, msg);
          }
        );
    } else {
      this.notcorrecrError = true;
    }
  }
}
