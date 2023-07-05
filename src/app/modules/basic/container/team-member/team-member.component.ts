import { Component, Input, Output, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../service/data.service';
import { BasicService } from '../../service/basic.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
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
	orgId: any = localStorage.getItem('organizationId');
	loader: boolean;

	searchFilter: any = {
		organizationId: this.orgId,
		role: [],
		offset: 0,
		count: 5,
		userStatus: [],
	};

	constructor(
		private api: BasicService,
		private service: DataService,
		private messageService: MessageService
	) {
		this.service.getSearchFilter().subscribe((res) => {
			this.getUserInfo(res, 0);
		});
		this.service.loader.subscribe((loader: any) => {
			this.loader = loader;
		});
	}

	ngOnInit(): void {
		this.adminInfo();
	}

	adminInfo() {
		this.api.getAdminDetails().subscribe(
			(res) => {
				this.service.setAdminInfo(res.adminDetails);
			},
			(error) => {
				this.messageService.displayError(true, error.error.msg);
			}
		);
	}
	getUserInfo(filter: any, counter) {
		// this.api.getTeamMemberList(filter).subscribe((res) => {
		// 	this.service.setUserList(res.userList);
		// });
	}

	handleAddMember(val: boolean) {
		this.addMember = true;
	}

	openUserInfo(user) {
		this.addMember = false;
		this.userInfo = user;
	}

	handleAdminDetail(detail: any) {
		this.userInfo = detail;
	}
}
