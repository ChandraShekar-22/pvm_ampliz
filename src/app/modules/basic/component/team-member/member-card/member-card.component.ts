import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-member-card',
	templateUrl: './member-card.component.html',
	styleUrls: ['./member-card.component.css'],
	animations: [
		trigger('inputAnimation', [
			transition(':enter', [
				style({ transform: 'translateY(100%)', opacity: 0 }),
				animate('300ms', style({ transform: 'translateY(0)', opacity: 1 })),
			]),
		]),
	],
})
export class MemberCardComponent implements OnInit {
	@Input() userInfo: any = [];
	@Input() loader: boolean;
	@Input() active: boolean;

	initials: string = '';

	statusClass: any = [
		{ key: 'Active', class: 'active-status', name: 'Active' },
		{ key: 'Inactive', class: 'deactivated-status', name: 'Deactivated' },
		{ key: 'InvitationExpired', class: 'invitation-expired-status', name: 'Invitation Expired' },
		{ key: 'Verified', class: 'invited-status', name: 'Invited' },
	];
	// Verified | Active | Inactive | InvitationExpired
	constructor() {}

	ngOnInit(): void {
		this.getInititals();
	}

	get getStatusClass() {
		let obj = this.statusClass.find((o) => o.key === this.userInfo.userStatus);
		return obj.class;
	}
	get getStatusName() {
		let obj = this.statusClass.find((o) => o.key === this.userInfo.userStatus);
		return obj.name;
	}

	getInititals() {
		this.initials = '';
		const name = this.userInfo.fullName;

		for (let i = 0; i < name.length; i++) {
			if (name.charAt(i) === ' ') {
				continue;
			}

			if (name.charAt(i) === name.charAt(i).toUpperCase()) {
				this.initials += name.charAt(i);

				if (this.initials.length == 2) {
					break;
				}
			}
		}
	}

	// get status() {}
}
