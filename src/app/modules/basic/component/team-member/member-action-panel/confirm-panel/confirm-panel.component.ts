import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { DataService } from 'src/app/modules/basic/service/data.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
	selector: 'app-confirm-panel',
	templateUrl: './confirm-panel.component.html',
	styleUrls: ['./confirm-panel.component.css']
})
export class ConfirmPanelComponent implements OnInit {
	@Input() show: boolean = false;
	@Input() activate: boolean = false;
	@Input() userInfo: any;
	@Output() cancel: EventEmitter<boolean> = new EventEmitter();

	params: any = {
		email: '',
		credit: 0,
		mobileCredit: 0
	};
	adminCredits: any = {};

	constructor(
		private api: BasicService,
		private service: DataService,
		private messageService: MessageService
	) {}

	async ngOnInit() {
		await this.service.getAdminInfo().subscribe((admin) => {
			this.adminCredits = admin.consumedCredit;
		});
	}

	get remainingCredit() {
		return this.adminCredits?.totalCredit - this.adminCredits?.consumedCredit;
	}
	get remainingMobileCredit() {
		return this.adminCredits?.totalMobileCredit - this.adminCredits?.consumedMobileCredit;
	}

	isCreditCorrect() {
		if (this.remainingCredit >= this.params.credit && this.params.credit >= 0) {
			return true;
		} else {
			return false;
		}
	}
	isMobileCreditCorrect() {
		if (this.remainingMobileCredit >= this.params.mobileCredit && this.params.mobileCredit >= 0) {
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

	handleSubmit() {
		const body = {
			email: this.userInfo.email
		};
		if (this.activate === false) {
			this.api.deactivateUser(body).subscribe(
				(res) => {
					// this.userInfo.userStatus == 'Active';
					// this.service.statusChanged.next(this.userInfo);
					this.service.getMemberList.next(true);
					const message = this.userInfo.fullName + ' Deactivated';
					this.messageService.display(true, message);
					this.handleCancel();
				},
				(err) => {
					this.messageService.displayError(true, err.message);
				}
			);
		} else {
			this.params.email = this.userInfo.email;
			this.api.activateUser(this.params).subscribe(
				(res) => {
					// this.userInfo.userStatus == 'Inactive';
					// this.service.statusChanged.next(this.userInfo);
					this.service.getMemberList.next(true);
					const message = this.userInfo.fullName + ' Activated';
					this.messageService.display(true, message);
					this.handleCancel();
				},
				(err) => {
					this.messageService.displayError(true, err.message);
				}
			);
		}
	}
	handleCancel() {
		this.cancel.emit(false);
	}
}
