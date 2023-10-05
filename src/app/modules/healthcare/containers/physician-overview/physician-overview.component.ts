import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { MessageService } from '../../../B2B/services/message.service';
import { DataService } from '../../services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
@Component({
	selector: 'app-physician-overview',
	templateUrl: './physician-overview.component.html',
	styleUrls: ['./physician-overview.component.css']
})
export class PhysicianOverviewComponent implements OnInit, AfterViewInit {
	columnDefs: any;
	tab = 1;
	overviewResult: any;
	physicianOverviewResult: any;
	paramsData: any;
	DataResult: any;
	subscriptions = [];
	headerData: any = '';
	subscribed: boolean;
	currentCredit: any;
	saveDrawer: boolean = false;
	notCorrectDrawer: boolean = false;
	showButtonLoader: boolean = false;
	physicianPractiseHospitals: any[] = [];
	affiliatedHospitals: any[] = [];
	similarPhysician: any[] = [];
	selectedTab = 1;
	cptDetails: any = [];
	hcpcsDetails: any = [];

	geoLocation: any = {
		lat: 0,
		lng: 0
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		public amplizService: AmplizService,
		private messageService: MessageService,
		private dataService: DataService,
		private domSanitizer: DomSanitizer
	) {
		this.columnDefs = [
			{
				headerName: 'Drug Name'
			},
			{
				headerName: 'Total claim'
			},
			{
				headerName: 'Total Drug Cost'
			},
			{
				headerName: 'Total Drug Cost 65+'
			}
		];
	}

	get phyHosInfo() {
		return this.physicianOverviewResult.physicianHospitalInfoData;
	}
	getMapUrl(hospitalLocation: string) {
		return this.domSanitizer.bypassSecurityTrustResourceUrl(
			`https://www.google.com/maps/embed/v1/place?key=AIzaSyA9MPVyBx9QI03grz7fgaUuLmwcJ8lwd9k&q=${hospitalLocation}‌`
		);
	}

	get phyDrugInfo() {
		return this.DataResult;
	}
	get languages() {
		return this.physicianOverviewResult?.physicianInfoData?.languages?.join(', ') || '';
	}
	get showSimilarPhysicianTab() {
		return this.similarPhysician.length !== 0;
	}
	viewPhysicianMobileNumber() {
		this.amplizService
			.viewPhysicianMobileNumber(this.physicianOverviewResult.physicianInfoData.physicianId)
			.subscribe((res) => {
				this.viewDetail();
			});
	}
	viewPhysicianEmail() {
		this.amplizService
			.viewPhysicianEmail(this.physicianOverviewResult.physicianInfoData.physicianId)
			.subscribe((res) => {
				this.viewDetail();
			});
	}
	getPhysicianPractiseHospital() {
		this.amplizService.getPhysicianPractiseHospital(this.paramsData).subscribe((res) => {
			this.physicianPractiseHospitals = res.physicianPractiseHospitals.filter(
				(el) => el.hospitalLocation && el.hospitalName
			);
		});
	}
	getPhysicianAffiliatedHospital() {
		this.amplizService.getPhysicianAffiliatedHospital(this.paramsData).subscribe((res) => {
			this.affiliatedHospitals = res.affiliatedHospitals.filter((el) => el.hospitalLocation && el.hospitalName);
		});
	}
	get hideAffiliatedHospital() {
		return this.affiliatedHospitals.length !== 0;
	}
	get hideSimilarPhysician() {
		return this.similarPhysician.length !== 0;
	}
	get hidePhysicianPractiseHospitals() {
		return this.physicianPractiseHospitals.length !== 0;
	}
	get hospitalAddress() {
		const {
			address1 = '',
			address2 = '',
			hospitalName = '',
			city = '',
			state = ''
		} = this.physicianOverviewResult?.physicianInfoData || '';
		return [address1, address2, hospitalName, city, state].join(', ');
	}
	getSmiliarPhysician(speciality: string) {
		this.amplizService
			.getSmiliarPhysician({
				physicianId: this.paramsData,
				speciality,
				state: this.physicianOverviewResult.physicianInfoData.state,
				city: this.physicianOverviewResult.physicianInfoData.city
			})
			.subscribe((res) => {
				this.similarPhysician = res.similarPhysicianList;
			});
	}

	get gender() {
		if (this.physicianOverviewResult.physicianInfoData.gender) {
			return ['m', 'male'].includes(this.physicianOverviewResult.physicianInfoData.gender.toLowerCase())
				? 'Male'
				: 'Female';
		} else {
			return '';
		}
	}
	get experienceList() {
		return this.physicianOverviewResult.physicianInfoData.experience.filter((el) => !!el);
	}
	get isBlankHospitalInfo() {
		if (
			!this.phyHosInfo.webAddress &&
			!this.phyHosInfo.state &&
			!this.phyHosInfo.hospitalFax &&
			!this.phyHosInfo.country &&
			!this.phyHosInfo.city &&
			!this.phyHosInfo.address
		) {
			return true;
		} else {
			return false;
		}
	}

	// get isBlankPhysicianDrugInfo() {
	//   if (this.phyDrugInfo[0].prescribingDrugName =='' && this.phyDrugInfo[0].totalClaims == '') {
	//     return true;
	//   } else {
	//     return false;
	//   }
	// }

	get showSaveButton() {
		return this.physicianOverviewResult.physicianInfoData.leadSaveStatus !== 'Saved';
	}
	get hasEmail() {
		return (
			this.physicianOverviewResult?.physicianInfoData?.emailAddress &&
			this.physicianOverviewResult?.physicianInfoData?.emailAddress?.length === 0
		);
	}
	get hasPhoneNumber() {
		return (
			this.physicianOverviewResult?.physicianInfoData?.phoneNumber &&
			this.physicianOverviewResult?.physicianInfoData?.phoneNumber?.length === 0
		);
	}
	get saveButtonText() {
		return this.hasEmail && this.hasPhoneNumber
			? 'Request'
			: this.physicianOverviewResult.physicianInfoData.leadSaveStatus == 'NotSaved'
			? 'View'
			: 'Save';
	}
	get islocationAvailable() {
		return (
			this.physicianOverviewResult.physicianInfoData.address1 ||
			this.physicianOverviewResult.physicianInfoData.address2 ||
			this.physicianOverviewResult.physicianInfoData.city ||
			this.physicianOverviewResult.physicianInfoData.country
		);
	}
	ngOnInit() {
		this.paramsData = this.activatedRoute.snapshot.params['physicianId'];
		this.getPhysicianOverviewData();
		this.getPrescriberDrug();
		this.getPhysicianPractiseHospital();
		this.getPhysicianAffiliatedHospital();

		// this.getGeoLocation('1025 S 6th St ,Springfield, IL,62703');
	}
	ngAfterViewInit() {
		this.getDashboardDetails();
	}
	ngTab(value: any) {
		this.tab = value;
	}
	cancelBtnClick(value: boolean) {
		this.saveDrawer = value;
		this.notCorrectDrawer = value;
	}
	getPhysicianOverviewData() {
		this.amplizService.physicianOverviewDetails(this.paramsData).subscribe((res) => {
			this.overviewResult = res;

			this.physicianOverviewResult = res.physicianOverviewInfo;
			this.getSmiliarPhysician(this.physicianOverviewResult.physicianInfoData.specialty);
		});
	}
	refreshedData(ev: any) {
		if (ev === true) {
			this.getPhysicianOverviewData();
		}
	}
	tabselected(tab: number) {
		this.selectedTab = tab;
	}

	tabClick(ev: any) {
		var tabLabel = ev.tab.textLabel;
		if (tabLabel === 'Hospital Information') {
			this.getPhysicianOverviewData();
		} else if (tabLabel === "This Prescriber's Drugs") {
			this.getPrescriberDrug();
		}
	}
	async getDashboardDetails() {
		const authToken = await localStorage.getItem('auth_token');
		// const userId = await localStorage.getItem('user_id');
		const refreshToken = await localStorage.getItem('refresh_token');
		//
		if (authToken !== null && refreshToken !== null) {
			this.amplizService.getDashboardDetails().subscribe(
				(res) => {
					this.subscriptions = res.Subscriptions;
					this.currentCredit = res.CurrentCredits;
					if (this.subscriptions[0].SubscriptionType == 'Free') {
						localStorage.setItem('SubscriptionisActive', 'false');
						this.subscribed = false;

						this.headerData = 'Request Pricing';
					}
					if (this.subscriptions[0].SubscriptionType == 'Paid') {
						localStorage.setItem('SubscriptionisActive', 'true');
						this.subscribed = true;
					}
				},
				(error) => {
					if (error.status === 401) {
						this.amplizService.logout();
					}
					//
				}
			);
		} else {
			this.amplizService.logout();
		}
	}

	getPrescriberDrug() {
		this.amplizService.getPhysicianPrescriberDrugDetail(this.paramsData).subscribe((el: any) => {
			this.DataResult = el.physicianDrugInfo;
		});
	}

	request(request: any) {
		const body = {
			comid: '0',
			url: window.location.href,
			intentrequest: request
		};
		this.amplizService.request_access(body).subscribe((res) => {
			this.messageService.display(true, res.msg);
		});
	}

	viewPhysicianFromList() {
		const physicianId = this.physicianOverviewResult.physicianInfoData.physicianId;
		this.showButtonLoader = true;
		this.amplizService.viewPhysicianFromList(physicianId, null).subscribe(
			(res) => {
				this.viewDetail();
			},
			(err) => {
				this.showButtonLoader = false;
			}
		);
	}
	viewDetail() {
		this.amplizService
			.physicianOverviewDetails(this.physicianOverviewResult.physicianInfoData.physicianId)
			.subscribe(
				(res) => {
					this.showButtonLoader = false;
					this.overviewResult = res;
					this.physicianOverviewResult = res.physicianOverviewInfo;
				},
				(err) => {
					this.showButtonLoader = false;
				}
			);
	}

	handleSaveButtonPress() {
		const leadSaveStatus = this.physicianOverviewResult.physicianInfoData.leadSaveStatus;
		if (this.saveButtonText === 'Request') {
			this.request('Request for Phone And Email');
		} else if (leadSaveStatus == 'NotSaved') {
			this.viewPhysicianFromList();
		} else {
			this.saveDrawer = true;
		}
	}

	// getGeoLocation(address: any) {
	// 	var settings = {
	// 		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA9MPVyBx9QI03grz7fgaUuLmwcJ8lwd9k`,
	// 		method: 'GET',
	// 		timeout: 0
	// 	};
	// 	$.ajax(settings)
	// 		.done((response) => {
	// 			this.geoLocation = response.results[0].geometry.location;
	// 		})
	// 		.fail((error) => {
	// 			console.log(error);
	// 		});
	// }
}
