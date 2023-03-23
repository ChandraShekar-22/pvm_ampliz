import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
  selector: 'app-invite-teammate-drawer',
  templateUrl: './invite-teammate-drawer.component.html',
  styleUrls: ['./invite-teammate-drawer.component.css']
})
export class InviteTeammateDrawerComponent implements OnInit {
  @Output() closeInviteDrawer: EventEmitter<any> = new EventEmitter();
  @Output() teamMemberSubmitted: EventEmitter<any> = new EventEmitter();

  emailDomain: string = '';
  emailForm: UntypedFormGroup;
  constructor(private amplizService: AmplizService, private loaderService: LoaderService, private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getEmailDomain();
  }

  handlerInviteTeammateDrawer() {
    this.closeInviteDrawer.emit();
  }

  inviteTeamMember() {
    this.emailForm.markAsTouched();
    const body = {
      teamMemberEmailId: this.emailForm.value.emailId,
      role: 'TeamMemberUser'
    }
    if (this.emailForm.valid) {
      this.loaderService.display(true);
      this.amplizService.sendInviteToTeamMember(body).subscribe(res => {
        this.loaderService.display(false);
        this.teamMemberSubmitted.emit();
        // console.log("lineNO40", res);
        this.messageService.display(true, "invitation sent successfully");
        this.emailForm.reset();
      },
        err => {
          this.loaderService.display(false);
        });
    }
  }

  async getEmailDomain() {
    const emailId = localStorage.getItem('email_id');
    const splittedArr = emailId.split('@');
    if (splittedArr.length > 1) {
      this.emailDomain = emailId.split('@')[1];
    }
    this.emailForm = new UntypedFormGroup({
      emailId: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(`^[A-Za-z0-9._%+-]+@${this.emailDomain}$`)
      ]),
    });
    this.emailForm.markAsUntouched();
  }

}
