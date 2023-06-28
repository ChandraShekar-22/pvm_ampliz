import { BasicService } from '../../../service/basic.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
@Component({
	selector: 'app-member-side-panel',
	templateUrl: './member-side-panel.component.html',
	styleUrls: ['./member-side-panel.component.css'],
})
export class MemberSidePanelComponent implements OnInit {
	@Output() addMember: EventEmitter<boolean> = new EventEmitter();
	@Output() openUserInfo: EventEmitter<any> = new EventEmitter();
	@Output() adminCredits: EventEmitter<any> = new EventEmitter();
	@Input() getAdmin: any;

	// User Var
	adminDetails: any;

	membersListInput: any = [
		{
			organizationId: '',
			role: [],
			offset: 0,
			count: 5,
			userStatus: [],
		},
	];
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

	// General Var
	activeCard: any = null;
	filterCount: number = 0;
	adminActive: boolean = true;

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

	constructor(private api: BasicService) {}

	ngOnInit(): void {
		this.getAdminDetails();
		this.getAdmin.subscribe((v) => {
			if (v === true) {
				this.openAdmin();
			}
		});
	}

	getAdminDetails() {
		this.adminDetails = {
			fullName: 'Tanay Patidar',
			email: 'tanay.p@ampliz.com',
			teamMemberLimit: 100,
			consumedMemberLimit: 20,
			consumedCredit: 50,
			totalCredit: 100,
			totalMobileCredit: 100,
			consumedMobileCredit: 0,
		};

		// Uncomment when API is working
		// this.api.getAdminDetails().subscribe((res) => {
		// 	this.adminDetails = res.adminDetails;
		// });

		this.openAdmin();
	}

	getMembersList() {
		// Uncomment when API is working
		// this.api.getTeamMemberList(this.membersListInput).subscribe((res) => {
		// 	this.userList = res.userList;
		// });
	}

	getLicenceCounter() {
		return `<span>(${this.adminDetails.consumedMemberLimit} / ${this.adminDetails.teamMemberLimit})</span>`;
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
		this.adminActive = true;
		this.activeCard = null;
		this.openUserInfo.emit(this.adminDetails);
	}

	handleClick(user, index) {
		this.adminActive = false;
		this.activeCard = index;
		this.openUserInfo.emit(user);
	}

	addUser() {
		this.adminActive = false;
		this.activeCard = null;
		this.addMember.emit(true);
		this.adminCredits.emit(this.adminDetails);
	}
}
