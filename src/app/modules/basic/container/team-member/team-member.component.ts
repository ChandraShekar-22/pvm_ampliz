import { Component, Input, Output, OnInit, Renderer2 } from '@angular/core';
import { HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'app-team-member',
	templateUrl: './team-member.component.html',
	styleUrls: ['./team-member.component.css'],
})
export class TeamMemberComponent implements OnInit {
	addMember: boolean = false;

	openAdmin: Subject<boolean> = new Subject();

	userInfo: any;
	loader: boolean;

	emailArray: any;
	showError: boolean = false;
	emailError: string = '';

	filters: any = [
		{
			name: 'All',
			active: true,
		},
		{
			name: 'Sales',
			active: false,
		},
		{
			name: 'Marketing',
			active: false,
		},
		{
			name: 'Operation',
			active: false,
		},
		{
			name: 'Customer',
			active: false,
		},
		{
			name: 'Active',
			active: false,
		},
		{
			name: 'Inactive',
			active: false,
		},
		{
			name: 'Invited',
			active: false,
		},
		{
			name: 'Invitation Expired',
			active: false,
		},
	];

	constructor(private renderer: Renderer2) {}

	ngOnInit(): void {}

	handleFilter(filter, index) {
		if (index > 0) {
			this.filters[0].active = false;
			this.filters[index].active = !this.filters[index].active;
			const isActive = this.filters.filter((ele) => ele.active === true);
			if (isActive.length <= 0) {
				this.filters[0].active = true;
			}
		} else {
			this.filters.forEach((element) => {
				element.active = false;
			});
			this.filters[0].active = true;
		}
	}

	checkEmail() {
		var invalidEmails = this.anyInvalidEmails(this.emailArray);

		if (invalidEmails.length > 0) {
			var message = 'The following emails are invalid: ' + invalidEmails.join(', ');
			this.showError = true;
			this.emailError = message;
		} else {
			this.showError = false;
		}
	}
	anyInvalidEmails(emailArray: any) {
		var emailArray = emailArray.split(',');
		// var regex =
		//   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var regex = new RegExp(
			"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
		);
		// Loop through the emailArray and validate each email address
		const invalidEmails = [];
		for (var i = 0; i < emailArray.length; i++) {
			if (!regex.test(emailArray[i])) {
				// The email address is invalid, so add it to the invalidEmails array
				invalidEmails.push(emailArray[i]);

				// Highlight the invalid email address in red underline
				// var emailElement = document.getElementById('email').getElementsByTagName('textarea')[i];
				// console.log('email', emailElement);
				// emailElement.style.textDecoration = 'underline';
				// emailElement.style.color = 'red';
			}
		}
		console.log(invalidEmails);
		return invalidEmails;
	}

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
		}, 5000);
	}

	cancelAddMember(val) {
		this.openAdmin.next(true);
	}
}
