import { Component, Input, Output, OnInit, Renderer2 } from '@angular/core';
import { HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'app-team-member',
	templateUrl: './team-member.component.html',
	styleUrls: ['./team-member.component.css'],
})
export class TeamMemberComponent implements OnInit {
	isAdmin: boolean = true; //TEMP solution //Check cookie after dashboard implmentation

	addMember: boolean = false;

	openAdmin: Subject<boolean> = new Subject();
	openUser: Subject<any> = new Subject();

	userInfo: any;
	loader: boolean;

	constructor(private renderer: Renderer2) {}

	ngOnInit(): void {}

	handleAddMember(val: boolean) {
		this.loader = true;
		this.addMember = true;
		setTimeout(() => {
			this.loader = false;
		}, 500);
	}

	openUserInfo(user) {
		this.loader = true;
		this.addMember = false;
		this.userInfo = user;
		setTimeout(() => {
			this.loader = false;
		}, 500);
	}

	cancelAddMember() {
		this.openAdmin.next(true);
	}

	handleAdminDetail(detail: any) {
		this.userInfo = detail;
	}
}
