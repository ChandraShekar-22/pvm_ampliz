import { T } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-credit-action-cards',
	templateUrl: './credit-action-cards.component.html',
	styleUrls: ['./credit-action-cards.component.css'],
})
export class CreditActionCardsComponent implements OnInit {
	@Input() edit: boolean;
	@Output()
	cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
	constructor() {}

	ngOnInit(): void {}

	handleCancel(event) {
		this.cancel.emit(true);
	}
}
