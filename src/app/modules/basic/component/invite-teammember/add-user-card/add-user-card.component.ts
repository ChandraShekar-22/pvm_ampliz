import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActiveUser } from '../../../models/invite-teammember-models';

@Component({
  selector: "app-add-user-card",
  templateUrl: "./add-user-card.component.html",
  styleUrls: ["./add-user-card.component.css"],
})
export class AddUserCardComponent implements OnInit {
  userRoleOptions: any = [
    { text: "Admin", value: "Admin" },
    { text: "User", value: "TeamMemberUser" },
  ];
  actionOptions: any = ["Add / Remove credit", "Remove user"];
  @Input() isYourCard: boolean = false;
  @Input() selectedItem;
  @Input() user: ActiveUser = new ActiveUser();
  @Output() addRemoveCreditPressed: EventEmitter<any> = new EventEmitter();
  @Output() removeUserPressed: EventEmitter<any> = new EventEmitter();
  @Output() changePasswordClicked: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  handleActionChanged(option: any) {
    // console.log(option);
    if (option === "Add / Remove credit") {
      this.addRemoveCreditPressed.emit();
    } else {
      this.removeUserPressed.emit();
    }
  }
  handleChangePassword() {
    this.changePasswordClicked.emit();
  }
}
