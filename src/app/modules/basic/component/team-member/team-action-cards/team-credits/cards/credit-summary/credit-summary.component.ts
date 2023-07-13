import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'app-credit-summary',
	templateUrl: './credit-summary.component.html',
	styleUrls: ['./credit-summary.component.css'],
})
export class CreditsSummaryComponent implements OnInit {
	@Output() trigger: EventEmitter<any> = new EventEmitter();
	@Input() isAdmin: boolean;
	@Input() userCredits: any;

	creditDetails: any;

	constructor() {}

	ngOnInit(): void {}

	handleTrigger(action) {
		if (action === 'buy') {
			window.open('https://www.ampliz.com/book-your-demo', '_blank');
		} else {
			this.trigger.emit(action);
		}
	}
}
