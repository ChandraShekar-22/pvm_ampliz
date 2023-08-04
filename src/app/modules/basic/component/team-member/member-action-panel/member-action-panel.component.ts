import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DataService as b2bService } from 'src/app/modules/B2B/services/data.service';
import { DataService } from '../../../service/data.service';
import { BasicService } from '../../../service/basic.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
	selector: 'app-member-action-panel',
	templateUrl: './member-action-panel.component.html',
	styleUrls: ['./member-action-panel.component.css']
})
export class MemberActionPanelComponent implements OnInit {
	addUser: boolean = false;
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();

	userInfo: any;
	adminInfo: any;

	showPanel: boolean = false;

	loader: boolean;

	updateTime: any;
	activeTab: any = 0;
	tabItems: any = [
		{
			name: 'summary'
		},
		{
			name: 'lists'
		}
	];
	statusList: any = [
		{
			key: 'Invited',
			cta: 'Resend Invitation?',
			style: 'invited-status'
		},
		{
			key: 'Active',
			cta: 'Deactivate',
			style: 'active-status'
		},
		{
			key: 'Inactive',
			cta: 'Activate',
			style: 'inactive-status'
		},
		{
			key: 'InvitationExpired',
			cta: 'Resend Invitation?',
			style: 'expired-status'
		}
	];

	noResultFound: boolean = false;
	// Verified | Active | Inactive | InvitationExpired
	constructor(
		private dataService: b2bService,
		private service: DataService,
		private api: BasicService,
		private messageService: MessageService
	) {
		this.service.loader.subscribe((loader) => (this.loader = loader));
		this.service.noResultFound.subscribe((event: boolean) => {
			if (event) {
				this.noResultFound = true;
			} else {
				this.noResultFound = false;
			}
		});
	}

	async ngOnInit() {
		this.service.getUserInfo().subscribe((info) => {
			this.userInfo = info;
			this.activeTab = 0;
		});
		await this.getAdmin();
		this.service.addUser.subscribe((res) => {
			this.addUser = res;
		});
		this.service.cancelAddMember.subscribe((event) => {
			if (event) {
				this.addUser = false;
			}
		});
	}

	getAdmin() {
		this.service.getAdminInfo().subscribe((info) => {
			this.adminInfo = info;
		});
	}

	get isAdmin() {
		return this.service.isAdmin(this.userInfo);
	}

	ngAfterViewInit() {
		this.getTimeDifference();
	}

	// ngOnChanges(changes: SimpleChanges) {
	// 	let change = changes['this.userInfo'];
	// 	if (change.firstChange) {
	// 	}
	// }

	get getStatusCta() {
		if (!this.isAdmin) {
			let obj = this.statusList.find((o) => o.key === this.userInfo.userStatus);
			return obj.cta;
		}
	}
	get getStatusKey() {
		if (!this.isAdmin) {
			let obj = this.statusList.find((o) => o.key === this.userInfo.userStatus);
			return obj.key;
		}
	}

	getTimeDifference() {
		if (this.userInfo.hasOwnProperty('invitedOn')) {
			this.updateTime = this.dataService.getTimeDifference(this.userInfo.invitedOn);
		}
	}

	changeTab(requestedIndex: any) {
		this.activeTab = requestedIndex;
	}

	handleAction() {
		const body = {
			email: this.userInfo.email
		};
		if (this.getStatusKey == 'Active' || this.getStatusKey == 'Inactive') {
			this.showPanel = true;
		} else {
			this.resendInvitation(body);
		}
	}

	resendInvitation(body: any) {
		this.api.createInviteLink(body).subscribe(
			(res) => {
				this.service.getMemberList.next(true);
				this.messageService.display(true, 'Invitation sent');
			},
			(err) => {
				this.messageService.displayError(true, err.message);
			}
		);
	}
}
