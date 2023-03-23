import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';



@Component({
  selector: 'app-invite-teammember',
  templateUrl: './invite-teammember.component.html',
  styleUrls: ['./invite-teammember.component.css']
})
export class InviteTeammemberComponent implements OnInit {
  progress: number = 10;
  invitedCount: number = 0;
  totalCount: number = 3;
  emailId: string = "";
  emailDomain: string = "";

  emailForm = new UntypedFormGroup({
    emailId: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[^@]*')
      ]),
  });
  invitedEmailIds: Array<any> = [];
  constructor(
    private b2bService: B2bService,
    private loaderService: LoaderService,
    private msgService: MessageService
  ) { }

  ngOnInit() {
    this.getInvitedTeamMembers();
    this.getEmailDomain();
  }

  isInvitationValid(date: any) {

    const today: any = new Date();
    const invitationDate: any = new Date(date);
    const diffInDays = Math.floor((today -invitationDate)/ (24*60*60*1000));
    return diffInDays<7;
  }
  getInvitedTeamMembers() {
    this.b2bService.getInvitedEmailList().subscribe(res => {
      // console.log(res.invitedUserDetailsList);
      this.invitedEmailIds = res.invitedUserDetailsList;
      this.invitedCount = this.invitedEmailIds.length;
    },error=> {
      this.invitedEmailIds = [];
      this.invitedCount = 0;
    })
  }

  inviteTeamMember() {
    this.loaderService.display(true);
    const emailId = this.emailId+ '@'+this.emailDomain;
    this.b2bService.isUserInvited(emailId).subscribe(isInvited => {
      if(isInvited.invited ==false) {

        this.b2bService.inviteTeamMember(emailId).subscribe(res => {
          setTimeout(() => {
            this.getInvitedTeamMembers();
          }, 300);
          this.emailId = '';
          this.msgService.display(true,"Successfully invited the team member");
          this.loaderService.display(false);
        },
        err => {
          this.emailId = '';
          const error = err.error[0]||{};
          this.loaderService.display(false);
          this.msgService.displayError(true,(error.message||'Error'))
        });
      } else {
        this.emailId = '';
        this.loaderService.display(false);
        this.msgService.displayError(true,"User allready invited");
      }
      this.loaderService.display(false);
    }, err => {
      this.loaderService.display(false);
    });
  }

  async getEmailDomain() {
    const emailId = localStorage.getItem('email_id');
    const splittedArr = emailId.split('@');
    if(splittedArr.length > 1) {
      this.emailDomain = emailId.split('@')[1];
    }

  }

  resendInvitation(emailIdData) {
    // console.log(emailIdData);
    this.loaderService.display(true);
    this.b2bService.reInviteTeamMember(emailIdData.email).subscribe(res => {
      this.loaderService.display(false);
      this.msgService.display(true, "Successfully send the invitation");
      setTimeout(() => {
        this.getInvitedTeamMembers();
      }, 300);

    },
    err => {
      this.loaderService.display(false);
    });
  }

}
