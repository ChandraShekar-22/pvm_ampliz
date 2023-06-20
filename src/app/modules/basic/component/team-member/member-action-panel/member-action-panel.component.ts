import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
	selector: 'app-member-action-panel',
	templateUrl: './member-action-panel.component.html',
	styleUrls: ['./member-action-panel.component.css'],
})
export class MemberActionPanelComponent implements OnInit {
	@Input() userInfo: any;
	@Input() addUser: boolean = false;
	@Input() loader: boolean;
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();
	updateTime: any;
	activeTab: any = 0;
	tabItems: any = [
		{
			name: 'credits',
		},

		{
			name: 'lists',
		},
	];

	constructor(private dataService: DataService) {}
	ngOnInit(): void {
		this.updateTime = this.dataService.getTimeDifference(this.userInfo.invitedOn);
	}

	changeTab(requestedIndex: any) {
		this.activeTab = requestedIndex;
	}

	handleCancel(val: any) {
		this.cancelAddMember.emit(true);
	}
}
