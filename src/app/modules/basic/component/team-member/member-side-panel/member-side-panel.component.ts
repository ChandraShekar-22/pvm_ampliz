import { BasicService } from '../../../service/basic.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { interval, Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
@Component({
	selector: 'app-member-side-panel',
	templateUrl: './member-side-panel.component.html',
	styleUrls: ['./member-side-panel.component.css']
})
export class MemberSidePanelComponent implements OnInit {
	@Output() addMember: EventEmitter<boolean> = new EventEmitter();
	@Output() openUserInfo: EventEmitter<any> = new EventEmitter();
	@Output() adminCredits: EventEmitter<any> = new EventEmitter();

	searchTextChanged = new Subject<any>();

	// User Var
	adminDetails: any;

	membersListInput: any = {
		organizationId: localStorage.getItem('organizationId'),
		role: [],
		offset: 0,
		count: 7,
		userStatus: []
	};

	userList: any = [];

	searchMember: any = {
		offset: 0,
		count: 5,
		searchName: ''
	};

	// General Var
	activeCard: any = null;
	filterCount: number = 0;
	adminActive: boolean = true;
	listLoader: boolean = false;

	noResultFound: boolean = false;

	showAdmin: boolean = true;

	filterItems: any = [
		{
			name: 'Active',
			key: 'Active',
			category: 'status',
			checked: false
		},
		{
			name: 'Invited',
			key: 'Invited',
			category: 'status',
			checked: false
		},
		{
			name: 'Deactivated',
			key: 'Inactive',
			category: 'status',
			checked: false
		},
		{
			name: 'Invitation Expired',
			key: 'InvitationExpired',
			category: 'status',
			checked: false
		},
		{
			name: 'Sales',
			category: 'role',
			checked: false
		},
		{
			name: 'Marketing',
			category: 'role',
			checked: false
		},
		{
			name: 'Operations',
			category: 'role',
			checked: false
		},
		{
			name: 'Customer',
			category: 'role',
			checked: false
		}
	];

	// Scroll Var
	listScroll: any;

	constructor(
		private api: BasicService,
		private service: DataService,
		private messageService: MessageService
	) {
		// Search Member Logic with debounce
	}
	ngOnInit(): void {
		this.getAdminDetails();
		this.getMembersList(false);

		// Debounce for search
		this.searchTextChanged.pipe(debounce(() => interval(300))).subscribe(() => {
			this.api.searchMember(this.searchMember).subscribe((res) => {
				this.userList = res.userList;
				if (this.userList.length > 0) {
					this.service.setUserInfo(this.userList[0]);
					this.activeCard = 0;
				}
				this.service.loader.next(false);
			});
		});

		this.service.cancelAddMember.subscribe((event) => {
			if (event) {
				this.openAdmin();
			}
		});

		this.service.getMemberList.subscribe((event) => {
			if (event) {
				this.getMembersList(true);
				setTimeout(() => {
					this.getAdminDetails();
				}, 100);
			}
		});

		// this.scrollHandler();
	}

	ngOnDestroy() {
		this.listScroll.removeEventListener('scroll', () => {});
		this.membersListInput.offset = 0;
	}

	// scrollHandler() {
	// 	this.listScroll = document.getElementById('scrollContainer');
	// 	this.listScroll.scrollTop = 0;
	// 	const that = this;
	// 	this.listScroll.addEventListener('scroll', function (e) {
	// 		that.onScroll(e);
	// 	});
	// }

	// onScroll(event) {
	// 	// if (event.target.offsetHeight + event.target.scrollTop == event.target.scrollHeight) {
	// 	// 	this.listLoader = true;
	// 	// 	this.membersListInput.offset = this.membersListInput.offset + 7;
	// 	// 	this.getFreshList();
	// 	// }
	// }
	ngAfterViewInit(): void {}

	getAdminDetails() {
		this.service.loader.next(true);
		this.api.getAdminDetails().subscribe(
			(res) => {
				const admin = res.adminDetails;
				this.service.setAdminInfo(admin);
				this.adminDetails = admin;
				this.openAdmin();
				this.handleLoader();
			},
			(error) => {
				this.messageService.displayError(true, error.error.msg);
			}
		);
	}

	async getMembersList(reset?: any) {
		if (reset == true) {
			this.membersListInput.offset = 0;
		}
		this.service.loader.next(true);
		await this.api.getTeamMemberList(this.membersListInput).subscribe(
			(res) => {
				this.userList = res?.userList;
				if (this.activeCard !== null) {
					this.service.setUserInfo(this.userList[this.activeCard]);
					this.adminCredits.emit(this.adminDetails);
				}

				this.handleLoader();
			},
			(err) => {
				this.handleLoader();
			}
		);
	}

	handleShowMore() {
		if (this.adminDetails.consumedMemberLimit >= this.membersListInput.offset) {
			this.membersListInput.offset += 7;
			this.listLoader = true;
			this.getFreshList();
		}
	}

	async getFreshList() {
		await this.api.getTeamMemberList(this.membersListInput).subscribe((res) => {
			res.userList.map((item) => {
				if (this.userList.findIndex((existing) => existing.userId == item.userId) == -1) {
					setTimeout(() => {
						this.userList.push(item);
						if (this.userList.length <= 0) {
							this.openAdmin();
						}
					}, 500);
				}
			});
			setTimeout(() => {
				this.listLoader = false;
			}, 600);
		});
	}

	handleSearch() {
		if (this.searchMember.searchName !== '') {
			this.searchTextChanged.next(this.searchMember.searchName);
			this.service.loader.next(true);
			this.showAdmin = false;
		} else {
			this.openAdmin();
			this.getMembersList(true);
		}
	}

	// getLicenceCounter() {
	// 	return `<span>(${this.adminDetails.consumedMemberLimit} / ${this.adminDetails.teamMemberLimit})</span>`;
	// }

	get consumedLicence() {
		return this.adminDetails.consumedMemberLimit;
	}
	get licenceLimit() {
		return this.adminDetails.teamMemberLimit;
	}

	handleFilter(item: any) {
		this.getFilterCount();
		this.membersListInput.offset = 0;
		if (item.category === 'role') {
			this.handleRole(item);
		} else {
			const key = this.getFilterKey(item);
			this.handleStatus(key);
		}
	}

	getFilterKey(item: any) {
		let obj = this.filterItems.find((o) => o.name === item.name);
		return obj.key;
	}

	handleRole(item: any) {
		const itemIndex = this.membersListInput.role.findIndex((ele) => ele === item.name);
		if (itemIndex === -1) {
			this.membersListInput.role.push(item.name);
		} else {
			this.membersListInput.role.splice(itemIndex, 1);
		}
		this.getMembersList(false);
	}

	handleStatus(item: any) {
		const itemIndex = this.membersListInput.userStatus.findIndex((ele) => ele === item);
		if (itemIndex === -1) {
			this.membersListInput.userStatus.push(item);
		} else {
			this.membersListInput.userStatus.splice(itemIndex, 1);
		}
		this.getMembersList(false);
	}

	getFilterCount() {
		const newArray = this.filterItems.map((obj, index) => {
			return obj.checked == true;
		});
		this.filterCount = newArray.filter(Boolean).length;
		if (this.filterCount > 0) {
			this.activeCard = 0;
			this.showAdmin = false;
		} else {
			this.activeCard = null;
			this.showAdmin = true;
		}
	}

	openAdmin() {
		this.adminActive = true;
		this.activeCard = null;
		this.showAdmin = true;
		this.service.addUser.next(false);
		// this.openUserInfo.emit(this.adminDetails);
		this.service.setUserInfo(this.adminDetails);
	}

	handleClick(user, index) {
		this.adminActive = false;
		this.activeCard = index;
		// this.openUserInfo.emit(user);
		this.service.setUserInfo(user);
		this.service.addUser.next(false);
	}

	openInvitedUser() {
		// this.openUserInfo.emit(this.userList[0]);
		this.service.setUserInfo(this.userList[0]);
	}

	addUser() {
		this.adminActive = false;
		this.activeCard = null;
		this.service.addUser.next(true);
		// this.adminCredits.emit(this.adminDetails);
	}
	setAdminCredits(credits: any) {
		this.service.setAdminCredits(credits);
	}
	handleLoader() {
		setTimeout(() => {
			this.service.loader.next(false);
		}, 600);
	}
}
