import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	public memberInvited: BehaviorSubject<boolean> = new BehaviorSubject(false);
	public cancelAddMember: BehaviorSubject<boolean> = new BehaviorSubject(false);

	public adminInfo: BehaviorSubject<any> = new BehaviorSubject([]);

	public userList: BehaviorSubject<any> = new BehaviorSubject([]);

	public userInfo: BehaviorSubject<any> = new BehaviorSubject([]);

	public loader: BehaviorSubject<boolean> = new BehaviorSubject(false);

	public creditUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false);

	orgId: any = localStorage.getItem('organizationId');
	public searchFilter = new BehaviorSubject({
		organizationId: this.orgId,
		role: [],
		offset: 0,
		count: 5,
		userStatus: [],
	});

	constructor() {}
	// Admin
	setAdminInfo(value: any): void {
		this.adminInfo.next(value);
	}
	getAdminInfo() {
		return this.adminInfo.asObservable();
	}

	// User
	setUserList(value: any): void {
		this.userList.next(value);
	}
	getUserList() {
		return this.userList.asObservable();
	}

	// Filter
	setSearchFilter(value: any): void {
		this.searchFilter.next(value);
	}
	getSearchFilter() {
		return this.searchFilter.asObservable();
	}

	// Open user
	userClicked(value) {
		this.userInfo.next(value);
	}
	getUserInfo() {
		return this.userInfo.asObservable();
	}
}
