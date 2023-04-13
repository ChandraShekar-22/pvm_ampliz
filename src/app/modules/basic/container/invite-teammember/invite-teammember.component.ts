import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { ActiveUser, SeatsCreditsStatus } from '../../models/invite-teammember-models';

@Component({
  selector: 'app-invite-teammember1',
  templateUrl: './invite-teammember.component.html',
  styleUrls: ['./invite-teammember.component.css'],
})
export class InviteTeammemberComponent implements OnInit {
  public activeUserList: ActiveUser[] = [];
  public pendingUserList: any[] = [];
  public openInviteDrawer: boolean = false;
  public seatsCreditsStatus: SeatsCreditsStatus = new SeatsCreditsStatus();
  public openRemoveDrawer: boolean = false;
  public openAddRemoveCreditDrawer: boolean = false;
  public yourEmailId: string;
  public selectedUser: ActiveUser;
  public user = null;
  constructor(
    private amplizService: AmplizService,
    private router: Router,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.callUserList();
    this.yourEmailId = localStorage.getItem('email_id');
  }
  handleChangePasswordClick() {
    this.router.navigate(['editprofile']);
  }

  callUserList() {
    this.getSeatAndCreditStatus();
    this.getActiveUserList();
    this.getPendingUserList();
  }

  getSeatAndCreditStatus() {
    this.amplizService.getSeatAndCreditStatus().subscribe((seatCreditRes) => {
      // console.log(seatCreditRes);
      this.seatsCreditsStatus = seatCreditRes;
    });
  }

  getActiveUserList() {
    this.loaderService.display(true);
    this.amplizService.getActiveUserList().subscribe(
      (activeUserRes: any) => {
        this.loaderService.display(false);
        this.activeUserList = activeUserRes.activeUserList;
        this.activeUserList.unshift(activeUserRes.logedInUser);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  getPendingUserList() {
    this.loaderService.display(true);
    this.amplizService.getPendingUserList().subscribe(
      (pendingUserRes) => {
        // console.log(pendingUserRes);
        this.loaderService.display(false);
        this.pendingUserList = pendingUserRes.userList;
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  handleResendButton(emaiId: string) {
    // Write code for resend popup
    const body = {
      teamMemberEmailId: emaiId,
    };
    this.loaderService.display(true);
    this.amplizService.reSendInviteToTeamMember(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.messageService.display(true, 'Resend invitation succesfull');
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  handleRemoveUser(user: any) {
    this.selectedUser = user;
    this.openRemoveDrawer = true;
  }
  handleAddRemoveCredit(user: any) {
    this.selectedUser = user;
    this.openAddRemoveCreditDrawer = true;
  }
}
