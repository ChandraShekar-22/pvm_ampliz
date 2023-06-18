import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-team-credits',
	templateUrl: './team-credits.component.html',
	styleUrls: ['./team-credits.component.css'],
})
export class TeamCreditsComponent implements OnInit {
	isEdit: boolean;
	isAction: boolean;
	constructor() {}

	ngOnInit(): void {}

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
