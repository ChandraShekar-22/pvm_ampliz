import { Component, OnInit, Input } from '@angular/core';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
@Component({
	selector: 'app-team-credits',
	templateUrl: './team-credits.component.html',
	styleUrls: ['./team-credits.component.css'],
})
export class TeamCreditsComponent implements OnInit {
	@Input() isAdmin: boolean = true;
	@Input() userInfo: any;
	isEdit: boolean;
	isAction: boolean;

	adminCredits: any = {};
	userCredits: any = {
		totalCredit: 0,
		consumedCredit: 0,
		totalMobileCredit: 0,
		consumedMobileCredit: 0,
	};

	constructor(private api: BasicService) {}

	ngOnInit(): void {
		if (this.isAdmin) {
			this.getAdminCredits();
		} else {
			this.getUserCredits();
		}
	}

	getAdminCredits() {
		this.userCredits.totalCredit = this.userInfo.totalCredit;
		this.userCredits.consumedCredit = this.userInfo.consumedCredit;
		this.userCredits.totalMobileCredit = this.userInfo.totalMobileCredit;
		this.userCredits.consumedMobileCredit = this.userInfo.consumedMobileCredit;
	}

	getUserCredits() {
		this.userCredits.totalCredit = 100;
		this.userCredits.consumedCredit = 50;
		this.userCredits.totalMobileCredit = 50;
		this.userCredits.consumedMobileCredit = 25;

		// this.api.getMemberCreditDetails(this.userInfo.userId).subscribe((res) => {
		// 	this.userCredits = res.creditDetails;
		// });
	}

	handleTrigger(action) {
		this.isAction = true;
		if (action === 'edit') {
			this.isEdit = true;
		} else {
			this.isEdit = false;
		}
	}

	cancelAction(isCancel: boolean) {
		if (isCancel) {
			this.isAction = false;
		}
	}
}
