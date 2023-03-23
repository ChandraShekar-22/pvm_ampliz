import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { LTCService } from "src/app/modules/LTC/services/ltc.service";
import { ImagingService } from "src/app/modules/ImagingCenter/services/imaging.service";

@Component({
  selector: "app-notcorrect",
  templateUrl: "./notcorrect.component.html",
  styleUrls: ["./notcorrect.component.css"],
})
export class NotcorrectComponent implements OnInit {
  @Input() notCorrectDiv: boolean = true;
  @Input() physicianId: any;
  @Input() physicianName: any;
  @Input() executiveId: any;
  @Input() ltcId: any;
  @Input() imagingId: any;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  sideNav: boolean = false;
  notCorrectListForm: UntypedFormGroup;
  formSubmitAttempt: boolean;
  @Input() notCorrectList = [
    "Email Address",
    "Phone Number",
    "Name",
    "Speciality",
    "Hospital Name",
    "NPI Number",
    "Location",
  ];
  selectedIncorrectList: any = [];
  savedList: any;
  otherValInput: string = "";
  notcorrecrError: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    public amplizService: AmplizService,
    private messageService: MessageService,
    private ltcService: LTCService,
    private imagingService: ImagingService
  ) {
    this.notCorrectListForm = fb.group({
      inCorrectListName: [""],
      otherVal: [""],
    });
  }

  ngOnInit() {
    //
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
    setTimeout(() => {
      this.cancelBtnClick.emit(false);
    }, 500);
    this.sideNav = true;
    this.notCorrectDiv = false;
  }

  saveList() {
    this.formSubmitAttempt = true;
    var listId = this.notCorrectListForm.value.saveListName;
    if (this.otherValInput !== "") {
      this.selectedIncorrectList.push(this.otherValInput);
    }
    if (this.selectedIncorrectList.length > 0) {
      const id = this.physicianId;
      if (this.physicianId) {
        this.reportIncorrectPhysician();
      } else if (this.executiveId) {
        this.reportIncorrectExecutive();
      } else if (this.ltcId) {
        this.reportIncorrectLTC();
      } else if (this.imagingId) {
        this.reportIncorrectImaging();
      }
    } else {
      this.notcorrecrError = true;
    }
  }
  reportIncorrectImaging() {
    const body = {
      incorrectDataList: this.selectedIncorrectList,
      imagingCenterExecutive: this.imagingId
    }
    this.imagingService.reportDataNotCorrectForImaging(body).subscribe(res => {
      this.handleApiResponse();
      this.messageService.display(true, "Updated the information");
    },
      err => {
        this.handleApiResponse();
      });
  }

  reportIncorrectLTC() {
    const body = {
      incorrectDataList: this.selectedIncorrectList,
      ltcExecutiveId: this.ltcId
    }
    this.ltcService.reportDataNotCorrect(body).subscribe(res => {
      this.handleApiResponse();
      this.messageService.display(true, "Updated the information");
    },
      err => {
        this.handleApiResponse();
      });
  }

  reportIncorrectPhysician() {
    this.amplizService
      .reportIncorrectPhysicianData(
        this.physicianId,
        this.selectedIncorrectList
      )
      .subscribe(
        (res) => {
          this.handleApiResponse();
          this.messageService.display(true, "Thank you for your feedback");
        },
        (error) => {
          this.handleApiResponse();
        }
      );
  }


  reportIncorrectExecutive() {
    this.amplizService
      .reportIncorrectExecutiveData(
        this.executiveId,
        this.selectedIncorrectList
      )
      .subscribe(
        (res) => {
          this.handleApiResponse();
          this.messageService.display(true, "Thank you for your feedback");
        },
        (error) => {
          this.handleApiResponse();
        }
      );
  }

  handleApiResponse() {
    this.selectedIncorrectList = [];
    this.otherValInput = "";
    this.sideNav = true;
    this.cancelBtnClick.emit(false);
    this.notCorrectListForm.reset();
  }
}
