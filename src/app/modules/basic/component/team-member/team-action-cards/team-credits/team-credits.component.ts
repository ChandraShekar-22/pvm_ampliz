import { Component, OnInit, Input, SimpleChanges } from '@angular/core'
import { BasicService } from 'src/app/modules/basic/service/basic.service'
import { DataService } from 'src/app/modules/basic/service/data.service'
import { HistorySearchCardComponent } from '../../../b2b-dashboard/history-search-card/history-search-card.component'
@Component({
	selector: 'app-team-credits',
	templateUrl: './team-credits.component.html',
	styleUrls: ['./team-credits.component.css'],
})
export class TeamCreditsComponent implements OnInit {
	// @Input() isAdmin: boolean = true;
	// @Input() userInfo: any;
	// isAdmin: boolean = true;
	userInfo: any
	isEdit: boolean
	isAction: boolean

	adminCredits: any = {}
	userCredits: any = {
		totalCredit: 0,
		consumedCredit: 0,
		totalMobileCredit: 0,
		consumedMobileCredit: 0,
	}

	constructor(private api: BasicService, private service: DataService) {}

	async ngOnInit() {
		await this.service.getUserInfo().subscribe((res) => {
			this.isAction = false
			this.userInfo = res
			if (this.isAdmin) {
				this.getAdminCredits()
			} else {
				this.getUserCredits()
			}
		})
		await this.service.creditUpdated.subscribe((event) => {
			if (event && this.userInfo) {
				this.getAdminCredits()
				this.getUserCredits()
			}
		})
	}

	get isAdmin() {
		return this.service.isAdmin(this.userInfo)
	}

	getAdminCredits() {
		this.api.getAdminDetails().subscribe((res) => {
			this.adminCredits = res.adminDetails.consumedCredit
			if (this.isAdmin) {
				this.userCredits = this.adminCredits // For summary card
			}
			this.service.setAdminCredits(this.adminCredits)
		})
	}

	getUserCredits() {
		const body = {
			userId: this.userInfo.userId,
		}
		if (body.userId.length > 0) {
			this.api.getMemberCreditDetails(body).subscribe((res) => {
				this.userCredits = res.consumedCredit
			})
		}
	}

	handleTrigger(action) {
		this.isAction = true
		if (action === 'edit') {
			this.isEdit = true
		} else {
			this.isEdit = false
		}
	}

	cancelAction(isCancel: boolean) {
		if (isCancel) {
			this.isAction = false
		}
	}
}
