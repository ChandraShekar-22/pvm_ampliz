import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { AmplizService } from '../../../services/ampliz.service';
import { LoaderService } from '../../../services/loader.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
	selector: 'app-physician-image-card',
	templateUrl: './physician-image-card.component.html',
	styleUrls: ['./physician-image-card.component.css']
})
export class PhysicianImageCardComponent implements OnInit {
	@Input() physicianData: any;
	@Input() currentCredit: any;
	@Input() dataIndex: any;
	@Input() checkboxDisabled: boolean = false;
	@Input() isPhysician: boolean = true;
	@Input() isPaid: boolean = false;
	@Output() DataRefreshed: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() checkBoxChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() checkboxValue: boolean = true;
	isSpecialityUser: boolean;
	saveDrawer: boolean = false;
	notCorrectDrawer: boolean = false;
	showButtonLoader: boolean = false;
	smallResolution: boolean = false;
	showEmailLoader: boolean = false;
	showPhoneLoader: boolean = false;

	@ViewChild('emailTrigger') emailTrigger: MatMenuTrigger;
	@ViewChild('mobileTrigger') mobileTrigger: MatMenuTrigger;
	@ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;
	constructor(
		private router: Router,
		private elementRef: ElementRef,
		private amplizService: AmplizService,
		private dataService: DataService,
		private loaderService: LoaderService,
		private messageService: MessageService,
		private clipboard: Clipboard
	) {}

	get showSaveButton() {
		return this.physicianData.leadSaveStatus !== 'Saved';
	}
	get saveButtonText() {
		return this.physicianData.leadSaveStatus == 'Viewed' ? 'Save' : 'View';
	}
	get showReqesutButton() {
		return (
			(this.physicianData.phoneNumber.length <= 0 && this.physicianData.email.length <= 0) ||
			(this.physicianData.phoneNumber[0] === null && this.physicianData.email[0] === null)
		);
	}
	get isRequestEmail() {
		return (
			this.physicianData.email[0] == null ||
			this.physicianData.email.length <= 0 ||
			this.physicianData.email == ''
		);
	}
	get shortHospital() {
		if (this.physicianData.hospitalName.length > 30) {
			return true;
		} else {
			return false;
		}
	}
	get shortSpeciality() {
		if (this.physicianData.specialty.length > 30) {
			return true;
		} else {
			return false;
		}
	}
	get shortEmail() {
		if (this.physicianData.email[0].length > 30) {
			return true;
		} else {
			return false;
		}
	}
	get isMobileSaved() {
		return this.physicianData.mobileNumber.length > 0 && this.physicianData.leadSaveStatus === 'Saved';
	}
	get emailTooltip() {
		if (this.physicianData.emailExists && !this.physicianData.emailViewed) {
			return 'View email costs one credit';
		}
		if (
			(this.physicianData.emailViewed && this.physicianData.length === 0) ||
			!this.physicianData.emailExists
		) {
			return 'Request Email (If Ampliz finds a verified email, you will be charged one credit)';
		}
		if (this.physicianData.emailViewed && this.physicianData.email.length > 0) {
			return 'Email';
		}
	}
	get mobileTooltip() {
		if (this.physicianData.isMobile && !this.physicianData.mobileViewed) {
			return 'View direct dial costs one credit';
		}
		if (this.physicianData.mobileViewed && this.physicianData.mobileNumber.length > 0) {
			return 'Direct Dial';
		} else {
			return 'Request Direct Dial (If Ampliz finds a verified number, you will be charged one credit)';
		}
	}

	ngOnInit() {
		this.elementRef.nativeElement.style.setProperty('--animation-order', this.dataIndex + 1);
		if (window.innerWidth < 1100) {
			this.smallResolution = true;
		} else {
			this.smallResolution = false;
		}
	}
	ngAfterViewInit() {
		setTimeout(() => {
			this.isSpecialityUser = localStorage.getItem('is_SpecialityUser') == 'true' ? true : false;
		}, 10);
	}
	cancelBtnClick(value: boolean) {
		this.saveDrawer = value;
		this.notCorrectDrawer = value;
		// this.DataRefreshed.emit(true);
	}

	refreshedData(ev: boolean) {
		this.DataRefreshed.emit(ev);
	}

	onPhysicianNameClicked(ev) {
		if (ev.executiveId !== null && ev.executiveId !== undefined) {
			// this.router.navigate(['/executiveOverview',ev.executiveId]);
			this.router.navigate([]).then((result) => {
				window.open(`executiveOverview/${ev.executiveId}`, '_blank');
			});
		}
		if (ev.physicianId !== null && ev.physicianId !== undefined) {
			// this.router.navigate(['/physicianOverview',ev.physicianId]);
			this.router.navigate([]).then((result) => {
				window.open(`/physicianOverview/${ev.physicianId}`, '_blank');
			});
		}
	}

	goToHospital(id: any) {
		this.router.navigate([]).then((result) => {
			window.open(`/hospitalOverView/${id}`, '_blank');
		});
	}

	checkboxValueChange(event) {
		this.checkBoxChanged.emit(this.checkboxValue);
	}

	handleSaveButton() {
		if (this.physicianData.leadSaveStatus == 'NotSaved' && !this.showButtonLoader) {
			this.showButtonLoader = true;
			if (this.isPhysician == true) {
				this.viewPhysicianFromList();
			} else {
				this.viewExecutiveFromList();
			}
		} else {
			this.saveDrawer = true;
		}
	}
	viewPhysicianMobileNumber() {
		this.amplizService.viewPhysicianMobileNumber(this.physicianData.physicianId).subscribe(
			async (res) => {
				await this.viewDetail('mobile');
				this.showPhoneLoader = false;
			},
			(err) => {
				this.showPhoneLoader = false;
			}
		);
	}
	viewPhysicianEmail() {
		this.amplizService.viewPhysicianEmail(this.physicianData.physicianId).subscribe(
			async (res) => {
				// console.log(res);
				await this.viewDetail('email');
				this.showEmailLoader = false;
			},
			(err) => {
				this.showEmailLoader = false;
			}
		);
	}

	viewPhysicianFromList() {
		// this.loaderService.display(true);
		this.amplizService.viewPhysicianFromList(this.physicianData.physicianId, null).subscribe(
			(res) => {
				this.viewDetail();
			},
			(err) => {
				this.showButtonLoader = false;
			}
		);
	}
	viewDetail(dropDown?) {
		this.amplizService.physicianOverviewDetails(this.physicianData.physicianId).subscribe(
			async (res) => {
				this.showButtonLoader = false;

				await this.dataService.addToSavedPhysician([res.physicianOverviewInfo.physicianInfoData]);
				if (dropDown === 'email') {
					setTimeout(() => {
						this.emailTrigger.openMenu();
					}, 100);
				}
				if (dropDown === 'mobile') {
					setTimeout(() => {
						this.mobileTrigger.openMenu();
					}, 100);
				}
			},
			(err) => {
				this.showButtonLoader = false;
			}
		);
	}
	viewExecutiveFromList() {
		this.amplizService.viewExecutiveFromList(this.physicianData.executiveId, null).subscribe(
			(res) => {
				this.amplizService.executiveOverviewDetails(this.physicianData.executiveId).subscribe(
					(res) => {
						this.showButtonLoader = false;
						this.dataService.addToSavedExecutive([res.healthExecutiveOverviewInfo.healthExecutiveInfoData]);
					},
					(err) => {
						this.showButtonLoader = false;
					}
				);
			},
			(err) => {
				this.showButtonLoader = false;
			}
		);
	}
	request(request, id) {
		const body = {
			comid: '0',
			url: window.location.href + `/${id}`,
			intentrequest: request
		};
		this.amplizService.request_access(body).subscribe((res) => {
			this.messageService.display(true, res.msg);
		});
		this.showButtonLoader = false;
	}

	handleAction(type?, value?) {
		if (type === 'copy') {
			this.clipboard.copy(value);
			this.messageService.display(true, 'Copied!');
		} else if (type === 'close') {
			value === 'email' ? this.emailTrigger.closeMenu() : this.mobileTrigger.closeMenu();
		} else {
			document.location = 'mailto:' + this.physicianData.email;
		}
	}

	handleEmail() {
		this.showEmailLoader = true;
		if (this.physicianData.emailExists) {
			this.viewPhysicianEmail();
		} else {
			this.request('Request Email Access', this.physicianData.physicianId);
			this.showEmailLoader = false;
		}
	}
	handleMobile() {
		this.showPhoneLoader = true;
		if (this.physicianData.isMobile && !this.physicianData.mobileViewed) {
			this.viewPhysicianMobileNumber();
		} else {
			this.request('Request Mobile Number Access', this.physicianData.physicianId);
			this.showPhoneLoader = false;
		}
	}
}
