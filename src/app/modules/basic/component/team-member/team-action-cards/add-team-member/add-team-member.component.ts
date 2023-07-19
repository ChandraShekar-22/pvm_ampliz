import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { DataService } from 'src/app/modules/basic/service/data.service';
@Component({
	selector: 'app-add-team-member',
	templateUrl: './add-team-member.component.html',
	styleUrls: ['./add-team-member.component.css']
})
export class AddTeamMemberComponent implements OnInit {
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();
	// @Input() adminDetails: any;
	adminDetails: any;
	domain: any;
	// Role var
	roleList = ['Sales', 'Marketing', 'Operations', 'Customer'];
	//OrgId
	orgId: any = localStorage.getItem('organizationId');

	// API var
	params: any = {
		emails: [],
		role: this.roleList[0],
		organizationId: this.orgId,
		dailyCredit: 0,
		mobileCredit: 0,
		dataset: 'healthcare',
		verifiedemails: [],
		notVerifiedemails: []
	};

	// Email var
	emailList: string = '';
	invalidEmails: any = [];
	invalidDomains: any = [];
	alreadyExistEmails: any = [];

	regex = new RegExp(
		"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
	);

	// General Var
	activeRole = 0;
	loader: boolean = false;
	creditError: boolean = false;
	mobileCreditError: boolean = false;
	showConfirmEmails: any = '';

	constructor(
		private api: BasicService,
		private messageService: MessageService,
		private service: DataService
	) {}

	ngOnInit(): void {
		this.service.getAdminInfo().subscribe((admin) => {
			this.adminDetails = admin;
		});
		this.setDomain();
	}
	setDomain() {
		const email = this.adminDetails.email;
		this.domain = email.split('@').pop();
	}
	get enableBtn() {
		return this.params.emails.length > 0 && this.validateCredits();
	}
	get remainingCredit() {
		return this.adminDetails.consumedCredit.totalCredit - this.adminDetails.consumedCredit.consumedCredit;
	}
	get remainingMobileCredit() {
		return (
			this.adminDetails.consumedCredit.totalMobileCredit - this.adminDetails.consumedCredit.consumedMobileCredit
		);
	}
	get remainingLicence() {
		return this.adminDetails.teamMemberLimit - this.adminDetails.consumedMemberLimit;
		// return 2; //Uncommnet when correct value comes
	}
	get headerError() {
		return this.remainingCredit <= 0 || this.remainingMobileCredit <= 0;
	}
	validateDomain() {
		const emailArrays = this.params.emails.split(',');
		this.invalidDomains = [];
		emailArrays.map((email) => {
			const domain = email.split('@').pop();
			if (domain !== this.domain) {
				this.invalidDomains.push(email);
			}
		});
		if (this.invalidDomains.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	validateCredits() {
		return this.isCreditCorrect() && this.isMobileCreditCorrect();
	}

	validateAllConditions() {
		if (this.validateEmails() && this.validateDomain() && this.validateCredits() && this.remainingLicence > 0) {
			return true;
		} else return false;
	}

	validateEmails() {
		var emailArray = this.params.emails.split(',');
		this.invalidEmails = [];
		for (var i = 0; i < emailArray.length; i++) {
			if (!this.regex.test(emailArray[i])) {
				this.invalidEmails.push(emailArray[i]);
				console.log('VALIDE', this.invalidEmails, emailArray[i]);
			}
		}
		if (this.invalidEmails.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	isCreditCorrect() {
		if (this.remainingCredit > this.params.dailyCredit) {
			return true;
		} else {
			return false;
		}
	}
	isMobileCreditCorrect() {
		if (this.remainingMobileCredit > this.params.mobileCredit) {
			return true;
		} else {
			return false;
		}
	}

	handleSubmit() {
		if (this.validateAllConditions()) {
			this.loader = true;
			const body = {
				email: this.params.emails.split(', '),
				organizationId: this.params.organizationId
			};
			this.api.checkEmailExist(body).subscribe(
				(res) => {
					if (res.alreadyInOrg.length > 0) {
						this.loader = false;
						this.alreadyExistEmails.push(res.alreadyInOrg);
					} else {
						if (res.verifiedList.length > 0 || res.notVerifiedList.length > 0) {
							this.params.verifiedemails = res.verifiedList.length > 0 ? res.verifiedList : [];
							this.params.notVerifiedemails = res.notVerifiedList.length > 0 ? res.notVerifiedList : [];
							const emails: any = [...this.params.verifiedemails, ...this.params.notVerifiedemails];
							this.showConfirmEmails = emails.toString();
							this.params.emails = res.emailNotExist.length > 0 ? res.emailNotExist : [];
						} else {
							this.inviteTeamMember();
						}
					}
				},
				(error) => {
					this.loader = false;
					this.messageService.displayError(true, error.message);
				}
			);
		}
	}

	handleConfirmation(confirmation: boolean) {
		if (confirmation == true) {
			this.inviteTeamMember();
		} else {
			this.params.verifiedemails = [];
			this.params.notVerifiedemails = [];
			if (this.params.emails.length > 0) {
				this.inviteTeamMember();
			} else {
				this.loader = false;
				this.clearInputs();
			}
		}
	}

	inviteTeamMember() {
		if (typeof this.params.emails === 'string') {
			this.params.emails = this.params.emails.split(', ');
		}

		this.api.inviteTeamMember(this.params).subscribe(
			(res) => {
				this.messageService.display(true, 'The invitation has been sent.');
				this.service.getMemberList.next(true);
				// this.service.newMemberInvited.next(true);
				this.loader = false;
				this.clearInputs();
			},
			(error) => {
				this.messageService.displayError(true, error[0].message);
				this.loader = false;
			}
		);
	}

	handleCancel() {
		this.service.cancelAddMember.next(true);
	}

	increment(credit?) {
		if (credit) {
			if (this.isCreditCorrect()) {
				this.params.dailyCredit++;
			}
		} else {
			if (this.isMobileCreditCorrect()) {
				this.params.mobileCredit++;
			}
		}
	}
	decrement(credit?) {
		if (credit) {
			if (this.params.dailyCredit > 0) {
				this.params.dailyCredit--;
			}
		} else {
			if (this.params.mobileCredit > 0) {
				this.params.mobileCredit--;
			}
		}
	}
	clearInputs() {
		this.params = {
			emails: [],
			role: this.roleList[0],
			organizationId: this.orgId,
			dailyCredit: 0,
			mobileCredit: 0,
			dataset: 'healthcare',
			verifiedemails: [],
			notVerifiedemails: []
		};
		this.showConfirmEmails = '';
		this.invalidDomains = [];
		this.invalidEmails = [];
		this.alreadyExistEmails = [];
	}
}
