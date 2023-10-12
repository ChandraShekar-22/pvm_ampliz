import { Component, OnInit, Input, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AmplizService } from '../../../healthcare/services/ampliz.service';
import { LoaderService } from '../../../healthcare/services/loader.service';
import { SuccessmessageService } from '../../../healthcare/services/successmessage.service';
import { ErrorService } from '../../../healthcare/services/error.service';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../../../healthcare/services/data.service';
import { Subscription } from 'rxjs-compat';
import { MessageService } from '../../../B2B/services/message.service';
import { DataService as B2BService } from '../../../B2B/services/data.service';
import { B2bService } from '../../../B2B/services/b2b.service';
import { E } from '@angular/cdk/keycodes';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
	@Input() dashboard: boolean;
	// @Input() user: any;
	@Input() subscriptionStatus: any;
	@Input('header-data') data;
	@Input('user') user: any;
	@Input('chromestatus') chrome_button;
	public headerData;
	isSpecialityUser: boolean = false;
	subscribed: boolean = false;
	showLoader: boolean = false;
	showBtn: boolean = false;
	showChrmBtn: boolean;
	showSuccessMesssage = true;
	username = 'Name';
	hasNoExtension = false;
	// chrome_button = "";
	button = '';
	access_token = '';
	refresh_token = '';
	data_set = '';
	CurrentCredits = '';
	isPersonaSet = '';
	showError = false;
	@Input() elementName = '';
	dailyCurrentCredits: any;
	dailyUsedCredits: any;

	hcMenu: any = [
		{ name: 'Dashboard', sub: [], active: false, url: 'hcdashboard', icon: 'fa fa-home' },
		{
			name: 'Search',
			icon: 'fa fa-search',
			sub: [
				{
					name: 'Healthcare Professionals',
					icon: 'fa fa-user-md',
					active: false,
					url: 'physician',
					description: '4.6 million physicians, nurses and allied health professionals.'
				},
				{
					name: 'Executive',
					icon: 'fa fa-user-circle',
					active: false,
					url: 'executive',
					description: 'nearly 230,000 executives detailed title and contact information.'
				},
				{
					name: 'LTC',
					icon: 'fa fa-wheelchair-alt',
					active: false,
					url: 'ltc',
					description:
						'intelligence on nearly 100,000 skilled nursing, assisted living, home health and hospice organizations'
				},
				{
					name: 'Imaging',
					icon: 'fa fa-flask',
					active: false,
					url: 'imaging',
					description:
						'more than 18,000 imaging centers, enabling you to understand key metrics on executive contacts, organizational'
				},
				{
					name: 'MCO',
					icon: 'fa fa-building-o',
					active: false,
					url: 'payor',
					description: 'nearly 4,000 accountable care organizations, health information exchanges and payors.'
				},
				{
					name: 'Hospital',
					icon: 'fa fa-hospital-o',
					active: false,
					url: 'hospital',
					description: 'more than 9,300 distinct hospital and health system profiles'
				}
			],
			active: false,
			url: 'physician'
		},
		{
			name: 'Enrich',
			icon: 'fa fa-refresh',
			sub: [
				{
					name: 'NPI',
					icon: 'ti-export',
					active: false,
					url: 'npi-lookup',
					description: 'Upload NPI numbers and get email, phone and profile data.'
				}
			],
			active: false,
			url: 'npi-lookup'
		},
		{
			name: 'Lists',
			icon: 'fa fa-list',
			sub: [],
			active: false,
			url: 'lists'
		}
	];
	subNav: any = [];

	accountMenu = [
		{
			name: 'Edit Profile',
			icon: 'fa fa-gear',
			url: 'editprofile'
		},
		{
			name: 'Subscription',
			icon: 'mdi mdi-settings-outline',
			url: 'pricing'
		},
		{
			name: 'Teams',
			icon: 'mdi mdi-account-multiple',
			url: 'team-member'
		},
		{
			name: 'API',
			icon: 'fa fa-code',
			url: 'geneateapi'
		},
		{
			name: 'Logout',
			icon: 'ti-power-off',
			url: 'logout'
		}
	];

	b2bMenu: any = [
		{ name: 'Dashboard', sub: [], active: false, url: 'dashboard', icon: 'fa fa-home' },
		{
			name: 'Search',
			sub: [
				// {
				// 	name: 'B2B',
				// 	url: 'b2b',
				// 	active: false,
				// 	description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quasi asperiores provident',
				// 	icon: 'fa fa-search'
				// },
				{
					name: 'Company Search',
					url: 'company_search',
					active: false,
					description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quasi asperiores provident',
					icon: 'ti-world'
				},
				{
					name: 'Customer Ideal Profile',
					icon: 'ti-id-badge',
					url: 'idealprofile',
					active: false,
					description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quasi asperiores provident'
				}
			],
			url: 'company_search',
			active: false,
			icon: 'fa fa-search'
		},
		{
			name: 'Lists',
			url: 'b2b-list',
			active: false,
			sub: [],
			icon: 'fa fa-list'
		}
	];

	b2bAccountMenu: any = [
		{
			name: 'Teams',
			icon: 'mdi mdi-account-multiple',
			url: 'team-member'
		},
		{
			name: 'Edit Profile',
			icon: 'fa fa-gear',
			url: 'editprofile'
		},
		// {
		// 	name: 'Subscription',
		// 	icon: 'mdi mdi-settings-outline',
		// 	url: 'pricing'
		// },
		{
			name: 'Logout',
			icon: 'ti-power-off',
			url: 'logout'
		}
	];

	// dynamicList = ['npi-lookup'];

	constructor(
		public router: Router,
		private amplizService: AmplizService,
		private loaderService: LoaderService,
		private successMessage: SuccessmessageService,
		private errorService: ErrorService,
		private ngZone: NgZone,
		private cookieService: CookieService,
		private healthCareDataService: DataService,
		private messageService: MessageService,
		private b2bDataService: B2BService,
		private b2bService: B2bService
	) {
		// this.router = router;
		this.b2bDataService.refreshHeaderTrigger.subscribe((res) => {
			this.getDashboardDetails(); // To get the latest credit value after view-contact
		});
	}
	get dataSet() {
		return window.localStorage.getItem('Dataset');
	}
	ngOnInit() {
		this.getActiveNav();
	}

	getActiveNav() {
		if (this.dataSet !== 'B2B') {
			this.getHcActiveNav();
		} else {
			this.getB2BActiveNav();
		}
		this.getSubMenu();
	}

	getHcActiveNav() {
		let navList = [];
		this.hcMenu.map((item) => navList.push(item.url.toLowerCase()));
		if (navList.indexOf(this.elementName) > -1) {
			this.hcMenu.map((active) => (active = false));
			this.hcMenu[navList.indexOf(this.elementName)].active = true;
			navList = [];
		} else {
			let subList: any = [];
			// Search SubMenu
			this.hcMenu[1].sub.map((item) => subList.push(item.url.toLowerCase()));
			if (subList.indexOf(this.elementName) > -1) {
				this.hcMenu.map((active) => (active = false));
				this.hcMenu[1].active = true;
				subList = [];
			}
			// Enrich SubMenu
			this.hcMenu[2].sub.map((item) => subList.push(item.url.toLowerCase()));
			if (subList.indexOf(this.elementName) > -1) {
				this.hcMenu.map((active) => (active = false));
				this.hcMenu[2].active = true;
				subList = [];
			}
		}
	}

	getB2BActiveNav() {
		let navList = [];
		this.b2bMenu.map((item) => navList.push(item.url.toLowerCase()));
		if (navList.indexOf(this.elementName) > -1) {
			this.b2bMenu.map((active) => (active = false));
			this.b2bMenu[navList.indexOf(this.elementName)].active = true;
			navList = [];
		} else {
			let subList: any = [];
			this.b2bMenu[1].sub.map((item) => subList.push(item.url.toLowerCase()));
			console.log('I ekse', subList, this.elementName);
			if (subList.indexOf(this.elementName) > -1) {
				this.b2bMenu.map((active) => (active = false));
				this.b2bMenu[1].active = true;
				subList = [];
			}
		}
	}

	getSubMenu() {
		let list = [];
		if (this.dataSet !== 'B2B') {
			const index = this.hcMenu
				.map((item) => {
					return item.active;
				})
				.indexOf(true);
			if (index >= 0 && this.hcMenu[index].sub.length > 0) {
				this.subNav = this.hcMenu[index].sub;
				// Active Menu
				this.subNav.map((item) => list.push(item.url.toLowerCase()));
				const subIndex = list.indexOf(this.elementName);
				this.subNav.map((active) => (active = false));
				this.subNav[subIndex].active = true;
			}
		} else {
			const index = this.b2bMenu
				.map((item) => {
					return item.active;
				})
				.indexOf(true);
			if (index >= 0 && this.b2bMenu[index].sub.length > 0) {
				this.subNav = this.b2bMenu[index].sub;
				// Active Menu
				this.subNav.map((item) => list.push(item.url.toLowerCase()));
				const subIndex = list.indexOf(this.elementName);
				this.subNav.map((active) => (active = false));
				this.subNav[subIndex].active = true;
			}
		}
		// this.getDynamicNav();
	}

	// getDynamicNav() {
	// 	if (this.dynamicList[0] !== 'all') {
	// 		let tempSearchItem = [];
	// 		let index = [];

	// 		tempSearchItem = this.hcMenu[1].sub.map((item) => {
	// 			// index.push(item.url.indexOf());
	// 			return item.url.toLowerCase();
	// 		});
	// 		index = this.dynamicList.map((item) => {
	// 			return tempSearchItem.indexOf(item);
	// 		});
	// 		if (index.length !== -1) {
	// 			index.map((index) => {
	// 				this.hcMenu[1].sub.splice(index, 1);
	// 			});
	// 		} else {
	// 			console.log('IN ELSE');
	// 			tempSearchItem = this.hcMenu[2].sub.map((item) => {
	// 				return item.url.toLowerCase();
	// 			});
	// 			console.log('TEM', tempSearchItem);
	// 			index = this.dynamicList.map((item) => {
	// 				return tempSearchItem.indexOf(item);
	// 			});

	// 			console.log('index', index);
	// 			index.map((index) => {
	// 				this.hcMenu[2].sub.splice(index, 1);
	// 			});
	// 			console.log('MENY', this.hcMenu[2]);
	// 		}
	// 	}
	// }

	ngAfterViewInit() {
		this.access_token = this.cookieService.get('auth_token');
		this.refresh_token = this.cookieService.get('refresh_token');
		this.username = this.cookieService.get('username');
		this.CurrentCredits = this.cookieService.get('credits');
		this.isPersonaSet = this.cookieService.get('isPersonaSet');
		this.data_set = this.cookieService.get('Dataset');
		if (this.access_token != '') {
			localStorage.setItem('Dataset', this.data_set);
		}
		if (this.access_token != '') {
			localStorage.setItem('auth_token', this.access_token);
		}
		if (this.username != '') {
			localStorage.setItem('username', this.username);
		}
		if (this.refresh_token != '') {
			localStorage.setItem('refresh_token', this.refresh_token);
		}
		if (this.isPersonaSet != '') {
			localStorage.setItem('isPersonaSet', this.isPersonaSet.toString());
		}
		if (this.CurrentCredits != '') {
			localStorage.setItem('credits', this.CurrentCredits.toString());
		}
		setTimeout(() => {
			this.isSpecialityUser = localStorage.getItem('is_SpecialityUser') == 'true' ? true : false;
			// console.log(this.isSpecialityUser, "this.isSpecialityUser");
		}, 10);

		this.getDashboardDetails();
		// this.checkChromeExtenstion();

		setTimeout(() => {
			this.loaderService.status.subscribe((res) => {
				this.showLoader = res;
			});
			this.successMessage.statusActive.subscribe((res) => {
				this.showSuccessMesssage = res;
			});
			this.errorService.statusActive.subscribe((res) => {
				this.showError = res;
			});
			this.user = localStorage.getItem('username');
		});

		//this.username = localStorage.getItem('username');
	}

	async getB2bCredits() {
		this.b2bService.b2bCheckSubscriptionStatus().subscribe(
			(res) => {
				this.b2bDataService.passSubscriptionStatus(res);
				this.dailyCurrentCredits = res.dailyCredit;
				this.dailyUsedCredits = res.usedCredit;
				if (res.subscriptionStatusList[0].SubscriptionType == 'Free') {
					localStorage.setItem('SubscriptionisActive', 'false');
					this.subscribed = false;
				}
				if (res.subscriptionStatusList[0].SubscriptionType == 'Paid') {
					localStorage.setItem('SubscriptionisActive', 'true');
					this.button = 'button';
					this.subscribed = false;
				}
				this.subscriptionStatus = localStorage.getItem('SubscriptionisActive');

				if (this.subscriptionStatus == 'false') {
					if (this.dataSet != 'B2B') {
						this.button = 'Request Pricing';
						this.data = 'Request Pricing';
						this.showBtn = true;
					} else {
						this.button = 'Upgrade';
						this.data = 'Upgrade';
						this.showBtn = true;
					}
				}
				if (this.subscriptionStatus == 'true') {
					this.button = '';
					this.data = '';
					this.showBtn = false;
				}
			},
			(error) => {
				if (error.status === 401) {
					this.amplizService.logout();
				}
			}
		);
	}

	async getHcCredits() {
		this.amplizService.checkSubscriptionStatus().subscribe(
			(res) => {
				//
				if (res[0].Subscriptions[0].SubscriptionType == 'Free') {
					localStorage.setItem('SubscriptionisActive', 'false');
					this.subscribed = false;
					// this.button = "Request Pricing";
					// this.data = "Request Pricing";
				}
				if (res[0].Subscriptions[0].SubscriptionType == 'Paid') {
					localStorage.setItem('SubscriptionisActive', 'true');
					this.button = 'button';
					this.subscribed = false;
				}
				this.subscriptionStatus = localStorage.getItem('SubscriptionisActive');

				if (this.subscriptionStatus == 'false') {
					if (this.dataSet != 'B2B') {
						this.button = 'Request Pricing';
						this.data = 'Request Pricing';
						this.showBtn = true;
					} else {
						this.button = 'Upgrade';
						this.data = 'Upgrade';
						this.showBtn = true;
					}
				}
				if (this.subscriptionStatus == 'true') {
					this.button = '';
					this.data = '';
					this.showBtn = false;
				}
			},
			(error) => {
				if (error.status === 401) {
					this.amplizService.logout();
				}
				//
			}
		);
	}

	async getDashboardDetails() {
		const authToken = await localStorage.getItem('auth_token');
		// const userId = await localStorage.getItem('user_id');
		const refreshToken = await localStorage.getItem('refresh_token');

		//
		if (authToken !== null && refreshToken !== null) {
			if (this.dataSet === 'B2B') {
				this.getB2bCredits();
			} else {
				this.getHcCredits();
			}
		} else {
			this.amplizService.logout();
		}
	}

	logout() {
		this.amplizService.logout();
	}
	navigate(url: any, exception?: any) {
		if (url === 'logout') {
			this.amplizService.logout();
		} else {
			this.elementName = url;
			this.ngZone.run(() => this.router.navigateByUrl(url)).then();
		}
	}

	public openItem(path: string, payment?: any): void {
		let urlPath = path;
		if (path == 'B2B') {
			urlPath = 'payment';
		} else if (path == 'healthcare') {
			urlPath = 'hcpayment';
		}
		this.ngZone.run(() => this.router.navigateByUrl(urlPath)).then();
	}

	async requestPricing() {
		const emailId = await localStorage.getItem('email_id');
		this.loaderService.display(true);
		const body = { package: 'Enterprise', email: emailId };
		this.amplizService.getPrice(body).subscribe(
			(res) => {
				this.loaderService.display(false);

				this.messageService.display(true, 'Thanks for asking, will get back to you in 24 hrs');
			},
			(error) => {
				this.loaderService.display(false);
				this.messageService.displayError(true, error.error.msg ? error.error.msg : 'Server Error !!!');
			}
		);
	}
}
