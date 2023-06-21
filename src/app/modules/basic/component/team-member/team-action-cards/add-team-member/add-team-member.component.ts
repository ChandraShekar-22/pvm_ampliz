import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-add-team-member',
	templateUrl: './add-team-member.component.html',
	styleUrls: ['./add-team-member.component.css'],
})
export class AddTeamMemberComponent implements OnInit {
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();

	// Email var
	emailList: string = '';
	invalidEmails: any = [];
	regex = new RegExp(
		"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
	);

	// Role var
	roleList = ['Sales', 'Marketing', 'Operations', 'Customer'];
	activeRole = 0;
	// General Var
	loader: boolean = false;

	constructor() {}

	get enableBtn() {
		return this.emailList.length > 0;
	}

	validateEmails() {
		var emailArray = this.emailList.split(',');
		this.invalidEmails = [];
		for (var i = 0; i < emailArray.length; i++) {
			if (!this.regex.test(emailArray[i])) {
				this.invalidEmails.push(emailArray[i]);
			}
		}
	}

	ngOnInit(): void {}

	handleCancel() {
		this.cancelAddMember.emit(true);
	}

	handleSubmit() {
		this.validateEmails();
	}
}
