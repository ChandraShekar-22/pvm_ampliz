import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { SkeletonloaderService } from 'src/app/modules/healthcare/services/skeletonloader.service';
import { PaginationService } from 'src/app/modules/healthcare/services/pagination.service';

@Component({
	selector: 'app-hospital',
	templateUrl: './hospital.component.html',
	styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {
	tab = 1;
	hospitalSearchParameter: any = {};
	offset: number = 0;
	limit: number = 10;
	searchType: string;
	searchResult: any;
	totalSearchResult: any;
	netNewCount: number;
	totalCount: number;
	totalSize: any;
	pager: any = {};
	pagedItems: any;
	filterParams: any = {};
	subscriptions = [];
	headerData: any = '';
	subscribed: boolean;
	page: any;
	noResult: boolean = false;
	unLockDiv: boolean = false;
	filterChangeOmitted: boolean = false;
	showLoader: boolean = false;
	clientIp: any = '';
	constructor(
		public amplizService: AmplizService,
		private loaderService: SkeletonloaderService,
		private pagerservice: PaginationService
	) {}

	get subscriptionType() {
		return localStorage.getItem('SubscriptionisActive');
	}

	ngOnInit() {
		// this.getIPAddress();
		this.getDashboardDetails();
		// this.setPage(1);
	}
	ngAfterViewInit() {
		if (!this.filterChangeOmitted) {
			this.setPage(1);
		}
	}
	// getIPAddress() {
	//   this.amplizService.getIpAddress().subscribe(res => {
	//     console.log(res);
	//     this.clientIp = res.ip||'';
	//   },(err: any) => {

	//   });
	// }
	async getDashboardDetails() {
		setTimeout(() => {
			this.loaderService.status.subscribe((res) => {
				this.showLoader = res;
			});
		});

		const authToken = await localStorage.getItem('auth_token');
		// const userId = await localStorage.getItem('user_id');
		const refreshToken = await localStorage.getItem('refresh_token');
		//
		if (authToken !== null && refreshToken !== null) {
			this.amplizService.getDashboardDetails().subscribe(
				(res) => {
					this.subscriptions = res.Subscriptions;
					if (this.subscriptions[0].SubscriptionType == 'Free') {
						localStorage.setItem('SubscriptionisActive', 'false');
						this.subscribed = false;

						this.headerData = 'Upgrade';
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
	filterChanged(event: any) {
		this.filterChangeOmitted = true;
		this.filterParams.hospitalName = event.hospitalName;
		this.filterParams.hospitalType = event.hospitalType;
		this.filterParams.numberOFBeds = event.numberOFBeds;
		this.filterParams.icdTenCodes = event.icdTenCodes;
		if (event.city) {
			this.filterParams.city = event.city.map((city) => city.city);
		}
		this.filterParams.specialityIncluded = event.specialityIncluded;
		if (event.stateList) {
			this.filterParams.stateList = event.stateList.map((state) => state.state);
		}
		this.getHospitalSearchData();
	}
	getHospitalSearchData() {
		this.loaderService.display(true);
		this.hospitalSearchParameter.offset = this.offset;
		this.hospitalSearchParameter.limit = this.limit;
		// this.hospitalSearchParameter.clientIp = this.clientIp;
		// this.physicianSearchParameter.searchType = this.tab == 1? 'TOTAL' : 'NETNEW';
		this.amplizService.searchHospital(this.hospitalSearchParameter, this.filterParams).subscribe(
			(res) => {
				this.searchResult = res;
				this.totalSearchResult = res.hospitalInfoList;
				// this.netNewCount = res.netNew;
				this.totalCount = res.totalResult;
				this.loaderService.display(false);
				if (this.totalSearchResult.length != 0) {
					this.noResult = false;
					this.totalSize = this.totalCount = res.totalResult;
					//
					this.pager = this.pagerservice.getPager(this.totalSize, this.page, this.limit);
					this.pagedItems = this.totalSearchResult.slice(this.pager.startIndex, this.pager.endIndex + 1);
					//
					this.loaderService.display(false);
					// this.loaderService.display(false);
				} else {
					this.noResult = true;
					this.loaderService.display(false);
				}
				//
			},
			(error) => {
				this.loaderService.display(false);
			}
		);
	}

	// ngTab(value: any) {
	//   this.tab = value;
	//   this.getHospitalSearchData();
	//   this.setPage(1);
	// }

	setPage(page: any) {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		if (this.subscribed === true || page === 1) {
			this.loaderService.display(true);
			window.scrollTo({ top: 0, behavior: 'smooth' });

			this.page = page;
			this.loaderService.display(true);
			this.offset = this.limit * (page - 1);
			// this.subscribed = tru
			this.hospitalSearchParameter.offset = this.offset;
			this.hospitalSearchParameter.limit = this.limit;
			// this.hospitalSearchParameter.clientIp = this.clientIp;
			this.amplizService.searchHospital(this.hospitalSearchParameter, this.filterParams).subscribe(
				(res) => {
					this.loaderService.display(false);
					this.unLockDiv = false;
					this.totalSearchResult = res.hospitalInfoList;

					if (this.totalSearchResult.length > 0) {
						this.noResult = false;
						this.totalSize = this.totalCount = res.totalResult;
						this.pager = this.pagerservice.getPager(this.totalSize, page, this.limit);
						this.pagedItems = this.totalSearchResult.slice(this.pager.startIndex, this.pager.endIndex + 1);
					} else {
						this.noResult = true;
						this.loaderService.display(false);
					}
				},
				(error) => {
					this.noResult = true;
					this.loaderService.display(false);
				}
			);
		} else {
			this.loaderService.display(false);
			this.unLockDiv = true;
			this.pager.currentPage = 2;
			this.offset = this.limit * (this.pager.currentPage - 1);
		}
	}
}
