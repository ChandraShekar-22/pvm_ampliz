import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { DataService } from 'src/app/modules/basic/service/data.service';
@Component({
	selector: 'app-credit-action-cards',
	templateUrl: './credit-action-cards.component.html',
	styleUrls: ['./credit-action-cards.component.css'],
})
export class CreditActionCardsComponent implements OnInit {
	@Input() edit: boolean;
	@Input() adminCredits: any = {};
	@Input() userCredits: any = {};
	@Input() userId: any = '';
	@Output()
	cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

	params: any = {
		userId: '',
		credit: 0,
		mobileCredit: 0,
	};

	constructor(
		private api: BasicService,
		private messageService: MessageService,
		private service: DataService
	) {}

	ngOnInit(): void {}

	ngOnChanges() {
		if (this.userCredits) {
			this.params.credit = this.userCredits.totalCredit;
			this.params.mobileCredit = this.userCredits.totalMobileCredit;
		}
	}

	get remainingCredits() {
		return this.adminCredits.totalCredit - this.adminCredits.consumedCredit;
	}
	get remainingMobileCredits() {
		return this.adminCredits.totalMobileCredit - this.adminCredits.consumedMobileCredit;
	}

	get differenceInCredit() {
		return this.params.credit - this.userCredits.totalCredit;
	}
	get differenceInMobileCredit() {
		return this.params.mobileCredit - this.userCredits.totalMobileCredit;
	}

	// isCreditCorrect() {
	// 	if (this.remainingCredits > this.params.credit) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }
	// isMobileCreditCorrect() {
	// 	if (this.remainingMobileCredits > this.params.mobileCredit) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	isCreditCorrect() {
		const isInteger = Number.isInteger(this.params.credit);
		if (this.remainingCredits > this.differenceInCredit && isInteger === true) {
			return true;
		} else {
			return false;
		}
	}
	isMobileCreditCorrect() {
		const isInteger = Number.isInteger(this.params.mobileCredit);
		if (this.remainingMobileCredits > this.differenceInMobileCredit && isInteger === true) {
			return true;
		} else {
			return false;
		}
	}

	get validateInput() {
		return (
			this.params.credit >= 0 &&
			this.params.mobileCredit >= 0 &&
			this.params.credit !== null &&
			this.params.mobileCredit !== null &&
			this.isCreditCorrect() &&
			this.isMobileCreditCorrect()
		);
	}

	updateCredits() {
		if (this.validateInput) {
			this.params.userId = this.userId;
			this.params.credit = this.differenceInCredit;
			this.params.mobileCredit = this.differenceInMobileCredit;
			this.api.updateCredits(this.params).subscribe(
				(res) => {
					this.cancel.emit(true);
					this.service.creditUpdated.next(true);
					this.messageService.display(true, 'Credits updated');
				},
				(error) => {
					this.messageService.displayError(true, error.message);
				}
			);
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

	handleCancel() {
		this.cancel.emit(true);
	}
}
