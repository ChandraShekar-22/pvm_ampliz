import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { SearchContactInput } from "src/app/modules/B2B/models/SearchContactModel";
import { DataService } from "src/app/modules/B2B/services/data.service";
import { AmplizService } from "../../../../healthcare/services/ampliz.service";
import { MessageService } from "../../../services/message.service";
@Component({
  selector: "app-people-card",
  templateUrl: "./people-card.component.html",
  styleUrls: ["./people-card.component.css"],
})
export class PeopleCardComponent implements OnInit {
  @Input() contactInfo: any;
  b2bSaveDrawer: boolean = false;
  showMore: boolean = true;
  sliceLength: number = 5;
  skillSet: Array<string> = [];
  saveBtnTrigger: boolean = false;
  // tempSaveBtn: boolean = true;
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Output() contactSaved = new EventEmitter();
  @Output() contactViewed = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;

  emailToShow: any = [];

  personalEmails = ["leonardoboston@hotmail.com"];
  workEmails = ["mcaicedo@tuftsmedicalcenter.org"];

  emailList = [];

  constructor(
    private dataService: DataService,
    private amplizService: AmplizService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getIndustryAndSkillset();
    this.resetSliceLength();
    this.sortEmails();
  }

  async sortEmails() {
    if (this.isEmailAvailable) {
      if (this.personalEmails.length > 0) {
        const obj: any = {};
        obj.email = this.personalEmails[0];
        obj.type = 'Personal'
        this.emailToShow.push(obj);

        this.personalEmails.map((x) => {
          const obj1:any = {}
          obj1.email = x;
          obj1.type = 'Personal'
          this.emailList.push(obj1);
        })
      } 
      if (this.workEmails.length > 0) {
        const obj: any = {};
        obj.email = this.workEmails[0];
        obj.type = 'Work'
        this.emailToShow.push(obj);

        this.workEmails.map((x) => {
          const obj1: any = {};
          obj1.email = x;
          obj1.type = 'Work'
          this.emailList.push(obj);
        })
      }
    }
  }

  get isEmailAvailable() {
    return this.contactInfo.personalEmails.length > 0 || this.contactInfo.workEmails.length > 0
  }

  get isSaved() {
    return this.contactInfo.leadSaveStatus === "Saved";
  }

  get showSaveButton() {
    return this.contactInfo.leadSaveStatus !== "Saved";
  }
  get isSaveButton() {
    return this.contactInfo.leadSaveStatus == "Viewed";
  }

  get showRequestContactBtn() {
    return (
      (this.contactInfo.directDialPhone.length <= 0 &&
        this.contactInfo.email.length <= 0) ||
      this.contactInfo.email.length <= 0 ||
      (this.contactInfo.directDialPhone[0] === null &&
        this.contactInfo.email[0] === null) ||
      this.contactInfo.email[0] === null
    );
  }

  get isEmailMasked() {
    if (this.contactInfo.email[0].indexOf("*") > -1) {
      return true;
    } else {
      this.saveBtnTrigger = true;
      return false;
    }
  }

  resetSliceLength() {
    if (window.screen.availWidth < 1300) {
      this.sliceLength = 3;
    } else {
      this.sliceLength = 5;
    }
  }
  getIndustryAndSkillset() {
    const skillList = this.contactInfo.skillList || [];
    this.skillSet = [...skillList];
  }
  invokeSaveList() {
    // console.log("save clicked")
    this.b2bSaveDrawer = true;
    // console.log(this.b2bSaveDrawer )
  }
  handleShowMore() {
    if (this.showMore == true) {
      this.sliceLength = this.contactInfo.skillList.length;
    } else {
      this.resetSliceLength();
    }
    this.showMore = !this.showMore;
  }

  openUrl(type) {
    const url = this.contactInfo[type];
    if (url !== "") {
      window.open(url, "popUpWindow");
    }
  }

  cancelBtnClick(value: boolean) {
    this.b2bSaveDrawer = value;
  }

  handleCheckboxChange(event) {
    this.checkboxChange.emit(this.checkboxSelected);
  }
  doSearchContact(key: string, skill: any) {
    const contactObj: SearchContactInput = new SearchContactInput();
    contactObj[key] = [skill];
    this.dataService.passSearchContactInput(contactObj);
  }
  // Request Email

  request(request: any, id: any) {
    const body = {
      comid: "0",
      url: window.location.href + `/${id}`,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe((res) => {
      this.messageService.display(true, res.msgInfo.msg);
    });
  }

  refreshValues(res) {
    // console.log("res", res);
    this.contactViewed.emit();
    this.contactInfo.email = res.email;
    this.contactInfo.phone = res.phone;
    this.contactInfo.linkedinURL = res.linkedinUrl;
    this.saveBtnTrigger = true;
  }
  contactReceived(res) {
    this.contactInfo = res;
  }
}
