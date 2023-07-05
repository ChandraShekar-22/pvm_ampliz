import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { DataService } from 'src/app/modules/basic/service/data.service';
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

	constructor(private api: BasicService, private service: DataService) {}

	ngOnInit(): void {
		if (this.isAdmin) {
			setTimeout(() => {
				this.getAdminCredits();
			}, 100);
		} else {
			this.getUserCredits();
		}
		this.service.creditUpdated.subscribe((event) => {
			if (event) {
				this.getUserCredits();
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.isAdmin) {
			this.getAdminCredits();
		} else {
			this.getUserCredits();
		}
	}

	getAdminCredits() {
		this.userCredits.totalCredit = this.userInfo.consumedCredit.totalCredit;
		this.userCredits.consumedCredit = this.userInfo.consumedCredit.consumedCredit;
		this.userCredits.totalMobileCredit = this.userInfo.consumedCredit.totalMobileCredit;
		this.userCredits.consumedMobileCredit = this.userInfo.consumedCredit.consumedMobileCredit;

		this.adminCredits = this.userCredits;
	}

	getUserCredits() {
		const body = {
			userId: this.userInfo.userId,
		};
		this.api.getMemberCreditDetails(body).subscribe((res) => {
			this.userCredits = res.consumedCredit;
		});
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
