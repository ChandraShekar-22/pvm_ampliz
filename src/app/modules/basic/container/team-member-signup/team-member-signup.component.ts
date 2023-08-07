import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicService } from '../../service/basic.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { P } from '@angular/cdk/keycodes';
@Component({
	selector: 'app-team-member-signup',
	templateUrl: './team-member-signup.component.html',
	styleUrls: ['./team-member-signup.component.css']
})
export class TeamMemberSignupComponent implements OnInit {
	signup = {
		fullName: '',
		email: '',
		set_password: '',
		confirm_password: '',
		show_set_password: false,
		show_confirm_password: false,
		policy: false
	};

	emailError: boolean = false;
	passwordError: boolean = false;
	passwordLengthError: boolean = false;

	emailVerified: boolean = false;

	loader: boolean = false;

	domainName: any;
	constructor(
		private activatedRoute: ActivatedRoute,
		private api: BasicService,
		private router: Router,
		private hcApi: AmplizService,
		private messageService: MessageService
	) {}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((params) => {
			if (Object.keys(params).length !== 0) {
				if (params.email && params.email.length > 0) {
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(params.email)) {
						this.signup.email = params.email;
					} else {
						this.messageService.displayError(true, 'The URL entered is invalid.');
					}
				}
			}
		});
	}

	get emptyForm() {
		return this.signup.fullName !== '' &&
			this.signup.confirm_password !== '' &&
			this.signup.set_password !== '' &&
			this.signup.policy == true
			? false
			: true;
	}

	handleSubmit() {
		this.emailError = false;
		this.passwordError = false;
		this.passwordLengthError = false;
		if (!this.emptyForm) {
			this.loader = true;
			var passwordVerified: boolean = this.validatePasswords();
			if (passwordVerified) {
				this.validateEmail();
			} else {
				this.loader = false;
			}
		}
	}

	validatePasswords() {
		const pwd = this.signup.set_password;
		const confirm_pwd = this.signup.confirm_password;

		if (pwd === confirm_pwd) {
			return true;
		} else {
			this.passwordError = true;
			return false;
		}
	}

	validateEmail() {
		const params = {
			email: this.signup.email
		};
		if (params.email.length > 0) {
			this.api.verifyTeamEmail(params).subscribe(
				(res) => {
					this.setPassword();
				},
				(err) => {
					this.messageService.displayError(true, 'Email not verified');
					this.loader = false;
				}
			);
		} else {
			this.loader = false;
		}
	}

	setPassword() {
		const params = {
			email: this.signup.email,
			fullName: this.signup.fullName,
			password: this.signup.confirm_password
		};
		if (params.fullName !== '' && params.password !== '') {
			this.api.setTeamMemberPassword(params).subscribe(
				(res) => {
					setTimeout(() => {
						this.login();
					}, 100);
				},
				(err) => {
					this.loader = false;
					this.messageService.displayError(true, 'Try again after some time');
				}
			);
		} else {
			this.loader = false;
		}
	}

	login() {
		const loginParams = {
			email: this.signup.email,
			pwd: this.signup.confirm_password
		};

		this.domainName = window.location.hostname;
		const myDate = new Date();
		myDate.setMonth(myDate.getMonth() + 1);
		this.domainName = this.domainName.substring(this.domainName.indexOf('.') + 1);
		document.cookie =
			'email_id=' + this.signup.email + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		this.hcApi.login(loginParams).subscribe(
			async (res) => {
				await this.setCookies(res);
				await this.setLocal(res);
				this.loader = false;

				if (res.Dataset === 'B2B') {
					this.router.navigate(['onboard']);
				} else {
					this.router.navigate(['hconboard']);
				}
			},
			(err) => {
				this.loader = false;
				this.messageService.displayError(true, err);
			}
		);
	}

	setCookies(res) {
		this.domainName = window.location.hostname;

		const myDate = new Date();
		myDate.setMonth(myDate.getMonth() + 12);
		this.domainName = this.domainName.substring(this.domainName.indexOf('.') + 1);
		document.cookie =
			'auth_token = ' + res.access_token + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		document.cookie =
			'refresh_token = ' + res.refresh_token + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		document.cookie =
			'username = ' + res.username + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		document.cookie =
			'credits = ' + res.CurrentCredits + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		document.cookie =
			'isPersonaSet = ' + res.isPersonaSet + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		document.cookie =
			'Dataset = ' + res.Dataset + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
		document.cookie = 'amp_u=1;expires=' + myDate + '; path=/; domain=.' + this.domainName;
	}
	async setLocal(res) {
		await localStorage.setItem('auth_token', res.access_token);
		await localStorage.setItem('refresh_token', res.refresh_token);
		await localStorage.setItem('username', res.username);
		await localStorage.setItem('credits', res.CurrentCredits.toString());
		await localStorage.setItem('isPersonaSet', res.isPersonaSet.toString());
		await localStorage.setItem('Dataset', res.Dataset);
		let is_SpecialityUser = res.isSpecialityUser || 'false';
		await localStorage.setItem('is_SpecialityUser', is_SpecialityUser.toString().toLowerCase());
		await localStorage.setItem('email_id', this.signup.email);
	}
}
