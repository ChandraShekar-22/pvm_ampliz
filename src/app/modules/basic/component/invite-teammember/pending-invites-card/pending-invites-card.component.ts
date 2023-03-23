import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pending-invites-card',
  templateUrl: './pending-invites-card.component.html',
  styleUrls: ['../add-user-card/add-user-card.component.css']
})
export class PendingInvitesCardComponent implements OnInit {
  userRoleOptions: any = ['Admin','User'];
  actionOptions: any = ['Add / Remove credit','Remove user'];
  selectedItem: string = 'Admin';
  @Input() isYourCard: boolean = false;
  @Input() role: any = '';
  @Input() invitedOn: any = '';
  @Input() email: any = '';
  @Output() resendButtonClicked: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  handleResendClick() {
    this.resendButtonClicked.emit();
  }
}
