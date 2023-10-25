import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	AfterViewInit,
	HostListener,
	ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { AmplizService } from '../../../services/ampliz.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Clipboard } from '@angular/cdk/clipboard';
import { A } from '@angular/cdk/keycodes';

@Component({
	selector: 'app-physican-image',
	templateUrl: './physican-image.component.html',
	styleUrls: ['./physican-image.component.css']
})
export class PhysicanImageComponent implements OnInit, AfterViewInit {
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

	actionLoader: boolean = false;
	requestEmailLoader: boolean = false;

	@ViewChild('contactPanelTrigger') contactPanelTrigger: MatMenuTrigger;

	constructor(
		private router: Router,
		private elementRef: ElementRef,
		private amplizService: AmplizService,
		private dataService: DataService,
		private loaderService: LoaderService,
		private messageService: MessageService,
		private clipboard: Clipboard
	) {}

	get shortTitle() {
		return this.physicianData.title.length > 16 ? true : false;
	}
	get shortHospital() {
		return this.physicianData.hospitalName.length > 30 ? true : false;
	}
	get location() {
		let location = `${this.physicianData.city}, ${this.physicianData.state}`;
		return location;
	}
	get shortLocation() {
		return this.location.length > 15 ? true : false;
	}

	get openPanel() {
		return !this.physicianData.phoneNumber[0]?.includes('*') &&
			!this.physicianData.email[0]?.includes('*') &&
			(this.physicianData.email.length > 0 || this.physicianData.phoneNumber.length > 0)
			? true
			: false;
	}
	get requestContact() {
		return this.physicianData.phoneNumber.length == 0 && this.physicianData.email.length == 0;
	}

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
	get emailTooltip() {
		if (!this.openPanel) {
			return 'Access email costs one credit';
		}
		if (this.requestContact) {
			return 'Request Email and Phone (If Ampliz finds a verified email, you will be charged one credit)';
		}
	}
	get actionButtonText() {
		if (this.physicianData.leadSaveStatus === 'Viewed') {
			return 'Save';
		}
		if (this.physicianData.leadSaveStatus === 'Saved') {
			return 'View';
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

	handleViewContact() {
		this.actionLoader = true;
		if (!this.requestContact) {
			this.viewExecutiveFromList();
		} else {
			this.requestBothContact();
		}
	}

	handleAction(type?: any, value?: any) {
		if (type === 'copy') {
			this.clipboard.copy(value);
			this.messageService.display(true, 'Copied!');
		} else if (type === 'close') {
			this.contactPanelTrigger.closeMenu();
		} else {
			document.location = 'mailto:' + this.physicianData.email;
		}
	}

	cancelBtnClick(value: boolean) {
		this.saveDrawer = value;
		this.notCorrectDrawer = value;
		// this.DataRefreshed.emit(true);
	}

	refreshedData(ev: boolean) {
		this.contactPanelTrigger.closeMenu();
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

	viewPhysicianFromList() {
		// this.loaderService.display(true);
		this.amplizService.viewPhysicianFromList(this.physicianData.physicianId, null).subscribe(
			(res) => {
				this.amplizService.physicianOverviewDetails(this.physicianData.physicianId).subscribe(
					(res) => {
						this.showButtonLoader = false;

						this.dataService.addToSavedPhysician([res.physicianOverviewInfo.physicianInfoData]);
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
	viewExecutiveFromList() {
		this.amplizService.viewExecutiveFromList(this.physicianData.executiveId, null).subscribe(
			(res) => {
				this.amplizService.executiveOverviewDetails(this.physicianData.executiveId).subscribe(
					(res) => {
						this.actionLoader = false;
						this.dataService.addToSavedExecutive([res.healthExecutiveOverviewInfo.healthExecutiveInfoData]);
						console.log('ph', this.physicianData);
						setTimeout(() => {
							this.contactPanelTrigger.openMenu();
						}, 200);
					},
					(err) => {
						this.actionLoader = false;
					}
				);
			},
			(err) => {
				this.actionLoader = false;
			}
		);
	}
	requestBothContact() {
		let arr = ['Request Email Access', 'Request Phone Number Access'];
		arr.map((request) => {
			this.request(request, this.physicianData.executiveId);
		});
	}
	request(request, id) {
		this.requestEmailLoader = true;
		const body = {
			comid: '0',
			url: window.location.href + `/${id}`,
			intentrequest: request
		};
		this.amplizService.request_access(body).subscribe(
			(res) => {
				this.messageService.display(true, res.msg);
				this.requestEmailLoader = false;
				this.actionLoader = false;
			},
			(error) => {
				this.actionLoader = false;
				this.requestEmailLoader = false;
			}
		);
	}
}
