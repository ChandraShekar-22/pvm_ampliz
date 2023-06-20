import { E } from '@angular/cdk/keycodes';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
@Component({
	selector: 'app-member-side-panel',
	templateUrl: './member-side-panel.component.html',
	styleUrls: ['./member-side-panel.component.css'],
})
export class MemberSidePanelComponent implements OnInit {
	@Output() addMember: EventEmitter<boolean> = new EventEmitter();
	@Output() openUserInfo: EventEmitter<any> = new EventEmitter();
	@Input() getAdmin: any;

	activeCard: any = null;

	filterCount: number = 0;

	userList: any = [
		{
			userId: '0x188d21ba1ca',
			fullName: 'Subbu V',
			email: 'subbu@ampliz.com',
			userStatus: 'Active',
			role: 'admin',
			credit: 100,
			invitedOn: '2023-06-19T15:46:32.235+08:00',
		},
		{
			userId: '0x188d21ba1cb',
			fullName: 'Mosahid Gani',
			email: 'mosahid.g@ampliz.com',
			userStatus: 'Active',
			role: 'sales',
			credit: 100,
			invitedOn: '2023-06-19T15:46:32.235+08:00',
		},
		{
			userId: '0x188d21ba1cc',
			fullName: 'Tanay Patidar',
			email: 'tanay.p@ampliz.com',
			userStatus: 'InvitationExpired',
			role: 'marketing',
			credit: 100,
			invitedOn: '2023-06-18T15:46:32.235+08:00',
		},
	];

	filterItems: any = [
		{
			name: 'Active',
			category: 'status',
			checked: false,
		},
		{
			name: 'Invited',
			category: 'status',
			checked: false,
		},
		{
			name: 'Deactivated',
			category: 'status',
			checked: false,
		},
		{
			name: 'Invitation Expired',
			category: 'status',
			checked: false,
		},
		{
			name: 'Sales',
			category: 'role',
			checked: false,
		},
		{
			name: 'Marketing',
			category: 'role',
			checked: false,
		},
		{
			name: 'Operations',
			category: 'role',
			checked: false,
		},
		{
			name: 'Customer',
			category: 'role',
			checked: false,
		},
	];
	constructor() {}

	ngOnInit(): void {
		this.getAdmin.subscribe((v) => {
			if (v === true) {
				this.openAdmin();
			}
		});
		this.openAdmin();
	}

	handleFilter() {
		this.getFilterCount();
		if (this.filterCount > 0) {
			console.log('ITEMS');
		}
	}

	getFilterCount() {
		const newArray = this.filterItems.map((obj, index) => {
			return obj.checked == true;
		});
		this.filterCount = newArray.filter(Boolean).length;
	}

	openAdmin() {
		this.activeCard = 0;
		this.openUserInfo.emit(this.userList[0]);
	}

	handleClick(user, index) {
		this.activeCard = index;
		this.openUserInfo.emit(user);
	}

	addUser() {
		this.activeCard = null;
		this.addMember.emit(true);
	}
}
