import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { DataService } from 'src/app/modules/B2B/services/data.service';
import { AmplizService } from '../../../../healthcare/services/ampliz.service';
import { MessageService } from '../../../services/message.service';
import { B2bService } from '../../../services/b2b.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { E } from '@angular/cdk/keycodes';
// import { TouchSequence } from 'selenium-webdriver';
// import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { MatMenu, MatMenuTrigger, matMenuAnimations } from '@angular/material/menu';

@Component({
  selector: 'app-people-card',
  templateUrl: './people-card.component.html',
  styleUrls: ['./people-card.component.css'],
})
export class PeopleCardComponent implements OnInit {
  @ViewChild('companyPanel') companyPanel: MatMenuTrigger;
  @Input()
  contactInfo: any;
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Output() contactSaved = new EventEmitter();
  @Output() contactViewed = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;
  b2bSaveDrawer: boolean = false;
  showMoreSkill: boolean = true;
  sliceLength: number = 5;
  skillSet: Array<string> = [];
  saveBtnTrigger: boolean = false;
  requestBtnTrigger: boolean = false;
  emailToShow: any = [];
  phoneToShow: any = [];
  allEmail: any = [];
  allPhone: any = [];
  showMoreList = [];
  companyPanelLoader: boolean = false;
  companyPanelList: any = [];
  descriptionSlice: number = 150;
  showFullDescription: boolean = true;

  companyPanelIcon: any = '../../../../../../assets/images/company-panel/';

  get isDomain() {
    return this.contactInfo.domain !== null;
  }
  get showEmail() {
    return this.isDomain && this.emailToShow[0] !== '' && !this.showRequestContactBtn;
  }
  get showPhone() {
    return this.isDomain && this.phoneToShow[0] !== '' && !this.showRequestContactBtn;
  }
  get showAllContacts() {
    return (this.allEmail.length > 0 || this.allPhone.length > 0) && !this.isEmailMasked;
  }
  get showRequestEmail() {
    return (
      this.emailToShow.length <= 0 && this.phoneToShow.length > 0 && !this.isEmailMasked && !this.showRequestContactBtn
    );
  }
  get showRequestPhone() {
    return (
      this.phoneToShow.length <= 0 && this.emailToShow.length > 0 && !this.isEmailMasked && !this.showRequestContactBtn
    );
  }
  get isEmailAvailable() {
    return (
      !this.showRequestContactBtn &&
      (this.contactInfo.personalEmails.length > 0 || this.contactInfo.workEmails.length > 0)
    );
  }
  get showSaveContactModal() {
    return (
      (this.showSaveButton || this.contactInfo.leadSaveStatus === 'NotSaved') &&
      !this.showRequestContactBtn &&
      !this.isSaved
    );
  }
  get isSaved() {
    return this.contactInfo.leadSaveStatus === 'Saved';
  }
  get showSaveButton() {
    return this.contactInfo.leadSaveStatus === 'Viewed' || this.saveBtnTrigger;
  }
  get showRequestContactBtn() {
    return !this.isDomain || this.contactInfo.leadSaveStatus == 'Request' || this.requestBtnTrigger;
  }

  get isEmailMasked() {
    if (
      this.contactInfo.personalEmails.length > 0 &&
      this.contactInfo.workEmails.length > 0 &&
      this.contactInfo.personalEmails !== null &&
      this.contactInfo.workEmails !== null
    ) {
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
    if (this.contactInfo.directDialPhone.length > 0 && this.contactInfo.directDialPhone[0] !== null) {
      if (this.contactInfo.directDialPhone[0].indexOf('*') > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  constructor(
    private dataService: DataService,
    private amplizService: AmplizService,
    private messageService: MessageService,
    private clipboard: Clipboard,
    private renderer: Renderer2,
    private b2bService: B2bService
  ) {}

  ngOnInit() {
    this.getIndustryAndSkillset();
    this.resetSliceLength();
    this.sortEmails();
    this.sortPhones();
  }

  sortEmails() {
    let emailList = [];
    this.emailToShow = [];
    this.allEmail = [];
    if (this.isEmailAvailable) {
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
    this.allPhone = [];
    this.phoneToShow = [];
    if (this.contactInfo.directDialPhone.length > 0) {
      this.phoneToShow.push(this.contactInfo.directDialPhone[0]);
      if (this.contactInfo.directDialPhone.length > 1) {
        this.contactInfo.directDialPhone.map((phone) => {
          this.allPhone.push(phone);
        });
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
    this.b2bSaveDrawer = true;
  }

  handleShowMore() {
    if (this.showMoreSkill == true) {
      this.sliceLength = this.contactInfo.skillList.length;
    } else {
      this.resetSliceLength();
    }
    this.showMoreSkill = !this.showMoreSkill;
  }

  openUrl(type) {
    const url = 'https://www.' + this.contactInfo[type];
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

  // Request Contact
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
    this.contactInfo.linkedinURL = res.linkedinUrl;

    if (res.personalEmails.length > 0 || res.workEmails.length > 0) {
      this.contactInfo.personalEmails = res.personalEmails;
      this.contactInfo.workEmails = res.workEmails;
      this.sortEmails();
    } else {
      this.emailToShow.length = [];
    }
    if (res.phone.length > 0) {
      this.contactInfo.directDialPhone = res.phone;
      this.sortPhones();
    } else {
      this.phoneToShow = [];
    }
    if (res.personalEmails.length > 0 || res.workEmails.length > 0 || res.phone.length > 0) {
      this.saveBtnTrigger = true;
    } else {
      this.requestBtnTrigger = true;
    }
    this.contactViewed.emit();
  }

  contactReceived(res) {
    this.contactInfo = res;
  }

  getCompanyDetails(trigger?: any) {
    this.companyPanelLoader = true;
    let domain = {
      webAddress: this.contactInfo.domain,
    };
    this.b2bService.getCompanyDetails(domain).subscribe(
      (res) => {
        // this.createCompanyObj(this.dataService.nonNullValuesinObj(res.companyDetails[0]));
        this.companyPanelList = res.companyDetails[0];
        this.companyPanelLoader = false;
        if (this.companyPanelList.industry.length > 0) {
          if (this.companyPanelList.industry.length > 1) {
            this.companyPanelList.industry = this.companyPanelList.industry.join(', ');
          } else {
            this.companyPanelList.industry = this.companyPanelList.industry.toString();
          }
        }
      },
      (err) => {
        this.messageService.displayError(true, 'Please try again later');
        this.companyPanelLoader = false;
        trigger.closeMenu();
      }
    );
  }

  openCompanyPanelUrl(link) {
    const url = `https://www.${link}`;
    if (url !== '') {
      window.open(url, 'popUpWindow');
    }
  }

  companyShowMore() {
    if (this.showFullDescription) {
      this.descriptionSlice = this.companyPanelList.companyDescription.length;
    } else {
      this.descriptionSlice = 150;
    }
    this.showFullDescription = !this.showFullDescription;
  }
}
