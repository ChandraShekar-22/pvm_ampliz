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
	memberTotalCount: number = 0;

	userList: any = [];

	searchMember: any = {
		searchName: ''
	};

	isAddUser: boolean = false;

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
	// listScroll: any;

	constructor(
		private api: BasicService,
		private service: DataService,
		private messageService: MessageService
	) {
		this.service.getMemberList.subscribe((event) => {
			if (event) {
				this.getMembersList(true);
				setTimeout(() => {
					this.getAdminDetails();
				}, 100);
			}
		});

		this.service.cancelAddMember.subscribe((event) => {
			if (event) {
				this.openAdmin();
			}
		});

		this.service.statusChanged.subscribe((event) => {});
	}
	async ngOnInit() {
		await this.getAdminDetails(true);
		this.getMembersList(false);

		// Debounce for search
		this.searchTextChanged.pipe(debounce(() => interval(300))).subscribe(() => {
			this.api.searchMember(this.searchMember).subscribe((res) => {
				this.userList = res.userList;
				if (this.userList.length > 0) {
					this.service.setUserInfo(this.userList[0]);
					this.activeCard = 0;
					this.service.noResultFound.next(false);
				} else {
					this.service.noResultFound.next(true);
				}
				this.service.loader.next(false);
			});
		});
		// this.scrollHandler();
	}

	ngOnDestroy() {
		// this.listScroll.removeEventListener('scroll', () => {});
		this.membersListInput.offset = 0;
	}
	// Scroll Loader
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

	//-------

	ngAfterViewInit(): void {}

	get showMore() {
		return this.userList.length >= 7 && this.membersListInput.offset < this.memberTotalCount;
	}

	getAdminDetails(openAdmin?) {
		this.service.loader.next(true);
		this.api.getAdminDetails().subscribe(
			(res) => {
				const admin = res.adminDetails;
				this.service.setAdminInfo(admin);
				this.adminDetails = admin;
				if (openAdmin === true) {
					this.openAdmin();
				}
				this.service.loader.next(false);
			},
			(error) => {
				this.messageService.displayError(true, error.error.msg);
				this.service.loader.next(false);
			}
		);
	}

	async getMembersList(reset: any) {
		if (reset == true) {
			this.membersListInput.offset = 0;
		}
		this.service.loader.next(true);
		await this.api.getTeamMemberList(this.membersListInput).subscribe(
			(res) => {
				this.userList = res?.userList;
				this.memberTotalCount = res.totalCount;

				if (this.activeCard !== null) {
					this.activeCard = 0; 
					this.service.setUserInfo(this.userList[this.activeCard]);
					this.adminCredits.emit(this.adminDetails);
				}
				if (this.filterCount > 0 && this.userList.length <= 0) {
					this.service.noResultFound.next(true);
				} else {
					this.service.noResultFound.next(false);
				}

				// if (this.isAddUser === true && this.activeCard === null) {
				// 	this.showAdmin = false;
				// 	this.adminCredits.emit(this.adminDetails);
				// 	console.log('IN ADD');
				// }
				this.service.loader.next(false);
			},
			(err) => {
				this.service.loader.next(false);
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
			this.memberTotalCount = res.totalCount;
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
			this.openAdmin();
		}
	}

	openAdmin() {
		this.adminActive = true;
		this.activeCard = null;
		this.showAdmin = true;
		this.service.addUser.next(false);
		// this.openUserInfo.emit(this.adminDetails);
		this.isAddUser = false;
		this.service.setUserInfo(this.adminDetails);
	}

	handleClick(user, index) {
		this.adminActive = false;
		this.activeCard = index;
		// this.openUserInfo.emit(user);
		this.service.setUserInfo(user);
		this.isAddUser = false;
		this.service.addUser.next(false);
	}

	openInvitedUser() {
		// this.openUserInfo.emit(this.userList[0]);
		this.service.setUserInfo(this.userList[0]);
	}

	async addUser() {
		this.adminActive = false;
		this.activeCard = null;
		this.isAddUser = true;
		this.service.addUser.next(true);

		// NoResulLogic
		this.service.noResultFound.next(false);
		if (this.filterCount > 0) {
			await this.filterItems.map((items) => {
				items.checked = false;
			});
			await this.getFilterCount();
			this.membersListInput = {
				organizationId: localStorage.getItem('organizationId'),
				role: [],
				offset: 0,
				count: 7,
				userStatus: []
			};
			await this.getMembersList(true);
		}

		if (this.searchMember.searchName !== '') {
			this.searchMember.searchName = '';
			this.getMembersList(true);
		}

		// this.adminCredits.emit(this.adminDetails);
	}
}
