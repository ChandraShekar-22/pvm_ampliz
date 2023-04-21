import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { DataService } from 'src/app/modules/B2B/services/data.service';
import { AmplizService } from '../../../../healthcare/services/ampliz.service';
import { MessageService } from '../../../services/message.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { E } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-people-card',
  templateUrl: './people-card.component.html',
  styleUrls: ['./people-card.component.css'],
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
  phoneToShow: any = [];
  allEmail: any = [];
  allPhone: any = [];
  showMoreList = [];

  showRequestPhone: boolean = true;

  // personalEmails = ['******@hotmail.com', '******@yahoo.com'];
  // workEmails = ['******@tuftsmedicalcenter.org', '******@hotmail.com'];

  constructor(
    private dataService: DataService,
    private amplizService: AmplizService,
    private messageService: MessageService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    this.getIndustryAndSkillset();
    this.resetSliceLength();
    this.sortEmails();
    this.sortPhones();
  }

  sortEmails() {
    if (this.isEmailAvailable) {
      let emailList = [];
      this.emailToShow = [];
      this.allEmail = [];
      if (this.contactInfo.workEmails.length > 0) {
        this.contactInfo.workEmails.map((work) => {
          const obj1: any = {};
          obj1.email = work;
          obj1.type = 'Work';
          emailList.push(obj1);
        });
      }
      if (this.contactInfo.personalEmails.length > 0) {
        this.contactInfo.personalEmails.map((personal) => {
          const obj1: any = {};
          obj1.email = personal;
          obj1.type = 'Personal';
          emailList.push(obj1);
        });
      }
      if (emailList.length > 0) {
        const obj: any = emailList[0];
        this.emailToShow.push(obj.email);
      }
      if (emailList.length > 1) {
        emailList.map((email) => {
          this.allEmail.push(email);
        });
      }
    }
  }

  sortPhones() {
    if (this.contactInfo.directDialPhone.length > 0) {
      console.log('PHONES', this.contactInfo.directDialPhone);
      this.allPhone = [];
      this.phoneToShow = [];
      this.phoneToShow.push(this.contactInfo.directDialPhone[0]);
      if (this.contactInfo.directDialPhone.length > 1) {
        this.contactInfo.directDialPhone.map((phone) => {
          this.allPhone.push(phone);
        });
      }
    }
  }

  get isEmailAvailable() {
    return this.contactInfo.personalEmails.length > 0 || this.contactInfo.workEmails.length > 0;
  }

  get isBothEmailAvaialble() {
    return this.contactInfo.personalEmails.length > 0 && this.contactInfo.workEmails.length > 0;
  }

  get isSaved() {
    return this.contactInfo.leadSaveStatus === 'Saved';
  }

  get showSaveButton() {
    return this.contactInfo.leadSaveStatus !== 'Saved';
  }
  get isSaveButton() {
    return this.contactInfo.leadSaveStatus == 'Viewed';
  }
  get requestPhone() {
    return this.phoneToShow.length <= 0 && this.emailToShow.length > 0;
  }

  get showRequestContactBtn() {
    return (
      (this.contactInfo.directDialPhone.length <= 0 && !this.isEmailAvailable) ||
      // this.contactInfo.personalEmails.length <= 0 ||
      (this.contactInfo.directDialPhone[0] === null &&
        this.contactInfo.personalEmails[0] === null &&
        this.contactInfo.workEmails[0] === null)
      // || this.contactInfo.personalEmails[0] === null
    );
  }

  get isEmailMasked() {
    if (this.contactInfo.personalEmails.length > 0 && this.contactInfo.workEmails.length > 0) {
      if (this.contactInfo.personalEmails[0].indexOf('*') > -1 && this.contactInfo.workEmails[0].indexOf('*') > -1) {
        return true;
      } else {
        return false;
      }
    } else if (this.contactInfo.personalEmails.length > 0) {
      if (this.contactInfo.personalEmails[0].indexOf('*') > -1) {
        return true;
      } else {
        return false;
      }
    } else if (this.contactInfo.workEmails.length > 0) {
      if (this.contactInfo.workEmails[0].indexOf('*') > -1) {
        return true;
      } else {
        return false;
      }
    }
  }
  get isPhoneMasked() {
    if (this.contactInfo.directDialPhone.length > 0) {
      if (this.contactInfo.directDialPhone[0].indexOf('*') > -1) {
        return true;
      } else {
        return false;
      }
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
    if (url !== '') {
      window.open(url, 'popUpWindow');
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
      comid: '0',
      url: window.location.href + `/${id}`,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe((res) => {
      this.messageService.display(true, res.msg);
    });
  }

  copyToClipboard(textToCopy: string) {
    this.clipboard.copy(textToCopy);
    this.messageService.display(true, 'Email copied to clipboard');
  }

  refreshValues(res) {
    // this.showMoreList = [];
    // this.allEmail = [];
    // this.allEmail = [];

    this.contactInfo.personalEmails = res.personalEmails.length > 0 ? res.personalEmails : [];
    this.contactInfo.workEmails = res.workEmails.length > 0 ? res.workEmails : [];
    this.contactInfo.directDialPhone = res.phone.length > 0 ? res.phone : [];
    this.contactInfo.linkedinURL = res.linkedinUrl;

    // console.log('CONTACT INFOR', this.contactInfo);

    this.sortEmails();
    this.sortPhones();
    this.contactViewed.emit();
    this.saveBtnTrigger = true;
  }
  contactReceived(res) {
    this.contactInfo = res;
  }
}
