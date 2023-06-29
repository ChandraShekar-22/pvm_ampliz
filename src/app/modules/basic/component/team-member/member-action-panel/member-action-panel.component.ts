import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
	statusList: any = [
		{
			key: 'Invited',
			cta: 'Resend Invitation?',
			style: 'invited-status',
		},
		{
			key: 'Active',
			cta: 'Deactivate',
			style: 'active-status',
		},
		{
			key: 'Inactive',
			cta: 'Activate',
			style: 'inactive-status',
		},
		{
			key: 'InvitationExpired',
			cta: 'Resend Invitation?',
			style: 'expired-status',
		},
	];
	// Verified | Active | Inactive | InvitationExpired
	constructor(private dataService: DataService) {}

	get isAdmin() {
		return !this.userInfo.hasOwnProperty('userStatus');
	}

	ngOnInit(): void {
		this.updateTime = this.dataService.getTimeDifference(this.userInfo.invitedOn);
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes.userInfo) {
			this.activeTab = 0;
		}
	}

	changeTab(requestedIndex: any) {
		this.activeTab = requestedIndex;
	}

	handleCancel(val: any) {
		this.cancelAddMember.emit(true);
	}
}
