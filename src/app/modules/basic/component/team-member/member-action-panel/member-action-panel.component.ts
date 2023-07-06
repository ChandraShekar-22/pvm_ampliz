import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DataService as b2bService } from 'src/app/modules/B2B/services/data.service';
import { DataService } from '../../../service/data.service';
import { BasicService } from '../../../service/basic.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
	selector: 'app-member-action-panel',
	templateUrl: './member-action-panel.component.html',
	styleUrls: ['./member-action-panel.component.css'],
})
export class MemberActionPanelComponent implements OnInit {
	// @Input() userInfo: any;
	@Input() addUser: boolean = false;
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();
	userInfo: any;
	loader: boolean;

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
	constructor(
		private dataService: b2bService,
		private service: DataService,
		private api: BasicService,
		private messageService: MessageService
	) {
		this.service.loader.subscribe((loader) => (this.loader = loader));
	}

	get isAdmin() {
		return !this.userInfo.hasOwnProperty('userStatus');
	}

	ngOnInit(): void {
		this.service.getUserInfo().subscribe((info) => {
			this.userInfo = info;
			this.activeTab = 0;
		});
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
			email: this.userInfo.email,
		};
		if (this.getStatusKey == 'Active') {
			this.deactivateUser(body);
		} else if (this.getStatusKey == 'Inactive') {
			this.activateUser(body);
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

	activateUser(body: any) {
		this.api.activateUser(body).subscribe(
			(res) => {
				this.service.getMemberList.next(true);
				this.userInfo.userStatus == this.statusList[2].key;
				const message = this.userInfo.fullName + ' Activated';
				this.messageService.display(true, message);
			},
			(err) => {
				this.messageService.displayError(true, err.message);
			}
		);
	}

	deactivateUser(body: any) {
		this.api.deactivateUser(body).subscribe(
			(res) => {
				this.service.getMemberList.next(true);
				this.userInfo.userStatus == this.statusList[1].key;
				const message = this.userInfo.fullName + ' Deactivated';
				this.messageService.display(true, message);
			},
			(err) => {
				this.messageService.displayError(true, err.message);
			}
		);
	}
}
