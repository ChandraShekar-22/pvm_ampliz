import { BasicService } from '../../../service/basic.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from '../../../service/data.service';
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

	membersListInput: any = {
		organizationId: localStorage.getItem('organizationId'),
		role: [],
		offset: 0,
		count: 7,
		userStatus: [],
	};
	userList: any = [];

	// General Var
	activeCard: any = null;
	filterCount: number = 0;
	adminActive: boolean = true;
	listLoader: boolean = false;

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

	// Scroll Var
	listScroll: any;

	constructor(private api: BasicService, private service: DataService) {}
	ngOnInit(): void {
		this.getAdminDetails();
		this.getMembersList();
		this.service.cancelAddMember.subscribe((event) => {
			if (event) {
				this.openAdmin();
			}
		});

		this.service.memberInvited.subscribe((event) => {
			if (event) {
				this.getMembersList();
			}
		});
		this.scrollHandler();
	}

	ngOnDestroy() {
		this.listScroll.removeEventListener('scroll', () => {});
	}

	scrollHandler() {
		this.listScroll = document.getElementById('scrollContainer');
		this.listScroll.scrollTop = 0;
		const that = this;
		this.listScroll.addEventListener('scroll', function (e) {
			that.onScroll(e);
		});
	}

	onScroll(event) {
		if (event.target.offsetHeight + event.target.scrollTop == event.target.scrollHeight) {
			this.listLoader = true;
			this.membersListInput.offset = this.membersListInput.offset + 7;
			this.getFreshList();
		}
	}
	ngAfterViewInit(): void {}

	getAdminDetails() {
		this.service.loader.next(true);
		this.service.getAdminInfo().subscribe((admin) => {
			this.adminDetails = admin;
			this.openAdmin();
			this.handleLoader();
		});
	}

	getMembersList() {
		this.service.loader.next(true);
		this.api.getTeamMemberList(this.membersListInput).subscribe(
			(res) => {
				this.userList = res.userList;
				this.handleLoader();
			},
			(err) => {
				this.handleLoader();
			}
		);
	}

	async getFreshList() {
		await this.api.getTeamMemberList(this.membersListInput).subscribe((res) => {
			res.userList.map((item) => {
				if (this.userList.findIndex((existing) => existing.userId == item.userId) == -1) {
					setTimeout(() => {
						this.userList.push(item);
					}, 500);
				}
			});
			setTimeout(() => {
				this.listLoader = false;
			}, 600);
		});
	}

	getLicenceCounter() {
		return `<span>(${this.adminDetails.consumedMemberLimit} / ${this.adminDetails.teamMemberLimit})</span>`;
	}

	handleFilter(item: any) {
		this.getFilterCount();
		if (item.category === 'role') {
			this.handleRole(item);
		} else {
			this.handleStatus(item);
		}
	}

	handleRole(item: any) {
		const itemIndex = this.membersListInput.role.findIndex((ele) => ele === item.name);
		if (itemIndex === -1) {
			this.membersListInput.role.push(item.name);
		} else {
			this.membersListInput.role.splice(itemIndex, 1);
		}
		this.getMembersList();
	}

	handleStatus(item: any) {
		const itemIndex = this.membersListInput.userStatus.findIndex((ele) => ele === item.name);
		if (itemIndex === -1) {
			this.membersListInput.userStatus.push(item.name);
		} else {
			this.membersListInput.userStatus.splice(itemIndex, 1);
		}
		this.getMembersList();
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

	openInvitedUser() {
		this.openUserInfo.emit(this.userList[0]);
	}

	addUser() {
		this.adminActive = false;
		this.activeCard = null;
		this.addMember.emit(true);
		this.adminCredits.emit(this.adminDetails);
	}

	handleLoader() {
		setTimeout(() => {
			this.service.loader.next(false);
		}, 600);
	}
}
