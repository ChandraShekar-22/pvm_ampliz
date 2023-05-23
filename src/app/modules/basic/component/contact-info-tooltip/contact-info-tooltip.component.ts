import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-contact-info-tooltip',
  templateUrl: './contact-info-tooltip.component.html',
  styleUrls: ['./contact-info-tooltip.component.css'],
})
export class ContactInfoTooltipComponent implements OnInit {
  params: any;
  email: any = [];
  emailList: any = [];
  emailToShow: any = [];
  phone: any;
  linkedIn: string;
  constructor() {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {
    // this.email = this.params.data.email;
    // if (this.params.data.personalEmails.length > 0) {
    //   this.params.data.personalEmails.map((email) => {
    //     this.email.push(email);
    //   });
    // }
    // if (this.params.data.workEmails.length > 0) {
    //   this.params.data.workEmails.map((email) => {
    //     this.email.push(email);
    //   });
    // }
    // console.log('EMAIL', this.email);
    // this.emailList = this.email.join('&#13;');
    // console.log('EMAIL List', this.emailList);

    this.sortEmails();
    this.phone = this.params.data.phoneNumber;
    this.linkedIn = this.params.data.linkedin_Uri;
  }

  sortEmails() {
    let workEmails = this.params.data.workEmails;
    let personalEmails = this.params.data.personalEmails;
    if (workEmails.length > 0) {
      workEmails.map((work) => {
        const obj1: any = {};
        obj1.email = work;
        obj1.type = 'Work';
        this.emailList.push(obj1);
      });
    }
    if (personalEmails.length > 0) {
      personalEmails.map((personal) => {
        const obj1: any = {};
        obj1.email = personal;
        obj1.type = 'Personal';
        this.emailList.push(obj1);
      });
    }

    this.emailList.map((email) => {
      this.emailToShow.push(email.email);
    });
  }

  // mapEmails() {
  //   this.emailList.map((item) => {
  //     this.emailTooltipText(item.type, item.email);
  //   });
  // }

  // emailTooltipText(type, email) {
  //   console.log('IN FUNC', type, email);
  //   return `
  //     ${type} : ${email}
  //     `;
  // }

  openDialog() {}
}
