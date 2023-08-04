import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from 'src/app/modules/basic/service/data.service';
@Component({
	selector: 'app-credit-summary',
	templateUrl: './credit-summary.component.html',
	styleUrls: ['./credit-summary.component.css']
})
export class CreditsSummaryComponent implements OnInit {
	@Output() trigger: EventEmitter<any> = new EventEmitter();
	@Input() isAdmin: boolean;
	@Input() userCredits: any;
	@Input() userInfo: any;

	creditDetails: any;

	constructor(private service: DataService) {
		this.service.getUserInfo().subscribe((user) => {});
	}

	ngOnInit(): void {}

	handleTrigger(action) {
		if (action === 'buy') {
			window.open('https://www.ampliz.com/book-your-demo', '_blank');
		} else {
			this.trigger.emit(action);
		}
	}
}
