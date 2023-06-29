import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { DataServiceService } from 'src/app/modules/basic/service/data-service.service';
@Component({
	selector: 'app-add-team-member',
	templateUrl: './add-team-member.component.html',
	styleUrls: ['./add-team-member.component.css'],
})
export class AddTeamMemberComponent implements OnInit {
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();
	@Input() adminDetails: any;
	// Role var
	roleList = ['Sales', 'Marketing', 'Operations', 'Customer'];

	// API var
	params: any = {
		emails: [],
		role: this.roleList[0],
		orgId: '5dc05c68df5693b4610fbf3d',
		credit: 0,
		mobileCredit: 0,
		dataset: 'healthcare',
	};

	// Email var
	emailList: string = '';
	invalidEmails: any = [];
	regex = new RegExp(
		"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
	);

	// General Var
	activeRole = 0;
	loader: boolean = false;
	creditError: boolean = false;
	mobileCreditError: boolean = false;

	constructor(
		private api: BasicService,
		private messageService: MessageService,
		private service: DataServiceService
	) {}

	ngOnInit(): void {}
	get enableBtn() {
		return this.params.emails.length > 0 && this.validateCredits();
	}
	get remainingCredit() {
		return this.adminDetails.totalCredit - this.adminDetails.consumedCredit;
	}
	get remainingMobileCredit() {
		return this.adminDetails.totalMobileCredit - this.adminDetails.consumedMobileCredit;
	}
	get remainingLicence() {
		return this.adminDetails.teamMemberLimit - this.adminDetails.consumedMemberLimit;
	}
	get headerError() {
		return this.remainingCredit <= 0 || this.remainingMobileCredit <= 0;
	}

	handleCancel() {
		this.service.cancelAddMember.next(true);
	}

	handleSubmit() {
		this.validateEmails();

		if (this.invalidEmails.length == 0 && this.validateCredits()) {
			this.api.inviteTeamMember(this.params).subscribe(
				(res) => {
					this.messageService.display(true, 'The invitation has been sent.');
					this.service.memberInvited.next(true);
				},
				(error) => {
					if (error.error[0]) {
						const msg: any = error.error[0].message ? error.error[0].message : 'Error';
						this.messageService.displayError(true, msg);
					}
				}
			);
		}
	}

	validateEmails() {
		var emailArray = this.params.emails.split(',');
		this.invalidEmails = [];
		for (var i = 0; i < emailArray.length; i++) {
			if (!this.regex.test(emailArray[i])) {
				this.invalidEmails.push(emailArray[i]);
			}
		}
	}
	validateCredits() {
		return this.isCreditCorrect() && this.isMobileCreditCorrect();
	}

	isCreditCorrect() {
		if (this.remainingCredit >= this.params.credit) {
			return true;
		} else {
			return false;
		}
	}
	isMobileCreditCorrect() {
		if (this.remainingMobileCredit >= this.params.mobileCredit) {
			return true;
		} else {
			return false;
		}
	}

	increment(credit?) {
		if (credit) {
			if (this.isCreditCorrect()) {
				this.params.credit++;
			}
		} else {
			if (this.isMobileCreditCorrect()) {
				this.params.mobileCredit++;
			}
		}
	}
	decrement(credit?) {
		if (credit) {
			if (this.params.credit > 0) {
				this.params.credit--;
			}
		} else {
			if (this.params.mobileCredit > 0) {
				this.params.mobileCredit--;
			}
		}
	}
}
