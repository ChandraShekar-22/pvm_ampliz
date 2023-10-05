import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	AfterViewInit,
	Output,
	EventEmitter,
	ChangeDetectionStrategy
} from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { SkeletonloaderService } from 'src/app/modules/healthcare/services/skeletonloader.service';
import { PaginationService } from '../../services/pagination.service';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SearchPhysicianModel } from '../../models/searchPhysicianModel';
import { FilterStorageService } from '../../services/filter-storage.service';

@Component({
	selector: 'app-physican',
	templateUrl: './physican.component.html',
	styleUrls: ['./physican.component.css']
})
export class PhysicanPageComponent implements OnInit, AfterViewInit {
	// @Output() DataRefreshed : EventEmitter<boolean> = new EventEmitter<boolean>();
	subscriptions = [];
	currentCredit: any;
	headerData: any = '';
	subscribed: boolean;
	deptartment_data = [1, 2, 3, 4, 5];
	tab = 1;
	physicianSearchParameter: SearchPhysicianModel = new SearchPhysicianModel();
	offset: number = 0;
	limit: number = 10;
	leadWithEmail: boolean = false;
	leadWithPhone: boolean = false;
	leadWithProvider: boolean = false;
	searchType: string;
	searchResult: any;
	totalSearchResult: any = [];
	netNewCount: number;
	totalCount: number;
	totalSize: any;
	pager: any = {};
	pagedItems: any;
	filterChangeOmitted: boolean = false;
	page: any;
	noResult: boolean = false;
	subscriptionVal: boolean;
	unLockDiv: boolean = false;
	public user = null;
	showLoader: boolean = false;
	pyTotalCount: any;
	newNetVal: boolean = false;
	clientIp: any = '';
	selectedPhysician: Array<string> = [];
	selectedPhysicianInCurrentPage: Array<any> = [];
	pageNumberOptions: Array<any> = [10, 20, 30, 40, 50];
	isSpecialityUser: boolean = false;
	showCountLoader: boolean = false;
	previousOffsets: Array<any> = [0];
	previousSavedOffsets: Array<any> = [0];
	savedPhysicians: Array<any> = [];
	emailTypeIsp: boolean = false;
	constructor(
		public amplizService: AmplizService,
		private loaderService: SkeletonloaderService,
		private pagerservice: PaginationService,
		private router: Router,
		private dataService: DataService,
		private filterStorageService: FilterStorageService
	) {}

	get subscriptionType() {
		return localStorage.getItem('SubscriptionisActive');
	}

	get isPaid() {
		return this.subscribed;
		// return true;
	}

	physicianCheckboxDisabled(item) {
		return item.leadSaveStatus == 'Saved' || !(this.isPaid == true || this.isSpecialityUser == true);
	}

	ngOnInit() {
		// this.getPhysicianSearchData();
		// this.getIPAddress();
		console.log('IN INIT');
		this.getDashboardDetails();
		this.saveDraftLeads();
		this.netNewCount = 0;
		setTimeout(() => {
			this.isSpecialityUser = localStorage.getItem('is_SpecialityUser') == 'true' ? true : false;
		}, 10);
		this.unmaskSavedPhysicians();
	}

	saveDraftLeads() {
		this.loaderService.display(true);
		this.amplizService.saveDraftLeads().subscribe(
			(res) => {
				this.loaderService.display(false);
			},
			(err) => {
				this.loaderService.display(false);
			}
		);
	}

	unmaskSavedPhysicians() {
		this.dataService.savedPhysicians.subscribe((res: Array<any>) => {
			if (res.length > 0) {
				this.getNetNewCount();
			}
			res.map((savedPhysician: any) => {
				const index = this.totalSearchResult.findIndex(
					(physicianItem) => savedPhysician.physicianId == physicianItem.physicianId
				);
				if (index !== -1) {
					this.totalSearchResult[index].phoneNumber = savedPhysician.phoneNumber;
					this.totalSearchResult[index].email = savedPhysician.emailAddress;
					this.totalSearchResult[index].mobileNumber = savedPhysician.mobileNumber;
					this.totalSearchResult[index].isMobile = savedPhysician.isMobile;
					this.totalSearchResult[index].emailExists = savedPhysician.emailExists;
					this.totalSearchResult[index].phoneExists = savedPhysician.phoneExists;
					this.totalSearchResult[index].emailViewed = savedPhysician.emailViewed;
					this.totalSearchResult[index].phoneViewed = savedPhysician.phoneViewed;
					this.totalSearchResult[index].mobileViewed = savedPhysician.mobileViewed;
					this.totalSearchResult[index].leadSaveStatus = savedPhysician.leadSaveStatus;
				}
			});
			// this.contactsList.updateContactsListFromSavedList(res);
		});
	}
	ngAfterViewInit() {
		setTimeout(() => {
			if (!this.filterChangeOmitted) {
				this.setPage(1);
			}
		}, 100);
		// this.getNetNewCount();
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
					this.currentCredit = res.CurrentCredits;
					this.subscriptions = res.Subscriptions;
					if (this.subscriptions[0].SubscriptionType == 'Free') {
						localStorage.setItem('SubscriptionisActive', 'false');
						this.subscribed = false;

						this.headerData = 'Request Pricing';
					}
					if (this.subscriptions[0].SubscriptionType == 'Paid') {
						//
						localStorage.setItem('SubscriptionisActive', 'true');
						this.subscribed = true;
					}
				},
				(error) => {
					if (error.status === 401) {
						this.amplizService.logout();
					}
				}
			);
		} else {
			this.amplizService.logout();
		}
	}
	filterChanged(event: any) {
		this.filterChangeOmitted = true;
		this.physicianSearchParameter.cityList = event.cityList.map((city) => city.city);
		this.physicianSearchParameter.cptCodes = event.cptCodes;
		this.physicianSearchParameter.hcpcsCodes = event.hcpcsCodes;
		this.physicianSearchParameter.hospitalNameList = event.hospitalNameList;
		this.physicianSearchParameter.physicianName = event.physicianName;
		this.physicianSearchParameter.specialityExcluded = event.specialityExcluded;
		this.physicianSearchParameter.specialityIncluded = event.specialityIncluded;
		this.physicianSearchParameter.stateList = event.stateList.map((state) => state.state);
		this.physicianSearchParameter.npiNumber = event.npiNumber;
		this.physicianSearchParameter.languages = event.languages;
		this.physicianSearchParameter.age = event.age ? `Age ${event.age}` : '';
		this.physicianSearchParameter.email_Score = event.email_Score;
		this.emailTypeIsp = event.emailTypeIsp;
		// this.leadWithEmail = event.leadWithEmail || false;
		this.leadWithEmail = event.leadWithEmail || false;
		this.leadWithProvider = event.provider_Type;
		this.physicianSearchParameter.experience = event.experience;
		this.offset = 0;
		this.saveDraftLeads();
		this.getPhysicianSearchData();
	}

	get showSaveAllCheckbox() {
		return (
			(this.selectedPhysicianInCurrentPage.length == 0 ||
				this.selectedPhysicianInCurrentPage.length == this.totalSearchResult.length) &&
			this.savedPhysicians.length < this.limit
		);
	}
	get showSaveAllPArtial() {
		return (
			this.selectedPhysicianInCurrentPage.length > 0 &&
			this.selectedPhysicianInCurrentPage.length < this.totalSearchResult.length
		);
	}
	getPhysicianSearchData() {
		this.previousOffsets = [0];
		this.previousSavedOffsets = [0];
		this.loaderService.display(true);
		this.setPhysicianSearchParams();
		this.amplizService.searchPhysician(this.physicianSearchParameter).subscribe(
			(res) => {
				this.searchResult = res;
				this.totalSearchResult = res.physicianInfoList;
				// this.netNewCount = res.netNew;

				//we are pushing the current offset value so that it can be reused
				// this.previousOffsets.push(res.offset);
				this.previousSavedOffsets.push(res.savedListOffset);
				this.totalCount = res.totalResult;
				this.totalSize = this.tab == 1 ? res.totalResult : res.netNew;
				this.loaderService.display(false);
				this.getNetNewCount();
				if (this.totalSearchResult.length !== 0) {
					this.noResult = false;
					this.totalCount = res.totalResult;
					// this.netNewCount = 0;
					this.pyTotalCount = res.totalResult;
					this.totalSize = this.tab == 1 ? res.totalResult : res.netNew;
					//
					this.pager = this.pagerservice.getPager(this.totalSize, this.page, this.limit);
					this.pagedItems = this.totalSearchResult.slice(this.pager.startIndex, this.pager.endIndex + 1);
				} else {
					this.noResult = true;
				}
				//
			},
			(error) => {
				this.loaderService.display(false);
			}
		);
	}

	ngTab(value: any) {
		this.tab = value;
		this.handleRecordsChange();
	}

	handleChange(value, model) {
		this.storeFilterData();
		this.loaderService.display(true);
		if (model === 'leadWithEmail') {
			this.physicianSearchParameter.leadWithEmail = value;
			this.amplizService.searchPhysician(this.physicianSearchParameter).subscribe(
				(res) => {
					this.loaderService.display(false);
					this.unLockDiv = false;
					this.totalSearchResult = res.physicianInfoList;
					//We are adding offset to that array

					this.previousOffsets.push(res.offset);
					this.previousSavedOffsets.push(res.savedListOffset);
					if (this.totalSearchResult.length !== 0) {
						this.noResult = false;
						this.selectedPhysicianInCurrentPage = this.totalSearchResult
							.filter((contactItem: any) => {
								return this.selectedPhysician.includes(contactItem.physicianId);
							})
							.map((item: any) => item.physicianId);
						this.savedPhysicians = this.totalSearchResult.filter((contactItem: any) => {
							return contactItem.leadSaveStatus == 'Saved';
						});
						this.totalCount = res.totalResult;
						if (this.tab === 1) {
							this.totalSize = res.totalResult;
						}
						if (this.tab === 2) {
							this.totalSize = this.netNewCount;
						}
						this.pagedItems = this.totalSearchResult.slice(this.pager.startIndex, this.pager.endIndex + 1);
						this.getNetNewCount();
					} else {
						this.noResult = true;
					}
				},
				(error) => {
					console.log('ER', error);
				}
			);
		}
	}
	getNetNewCount() {
		//we are taking the latest value of previous offsets array for providing the offset
		this.showCountLoader = true;
		this.setPhysicianSearchParams();
		this.amplizService.getPhysicianNetNewCount(this.physicianSearchParameter).subscribe((res) => {
			this.showCountLoader = false;
			this.netNewCount = res.netNew;
		});
	}

	setPhysicianSearchParams() {
		this.physicianSearchParameter.offset = this.offset;
		this.physicianSearchParameter.savedListOffset =
			this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;
		this.physicianSearchParameter.limit = this.limit;
		// this.physicianSearchParameter.emailTypeIsp = this.leadWithEmail
		//   ? "Yes"
		//   : "";
		this.physicianSearchParameter.emailTypeIsp = this.emailTypeIsp ? 'Yes' : '';
		this.physicianSearchParameter.provider_Type = this.leadWithProvider ? 'Independent' : '';
		this.physicianSearchParameter.leadWithEmail = this.leadWithEmail;
		this.physicianSearchParameter.leadWithPhone = this.leadWithPhone;
		this.physicianSearchParameter.searchType = this.tab === 1 ? 'TOTAL' : 'NETNEW';

		// this.physicianSearchParameter.clientIp = this.clientIp;
	}

	setPage(page: any, isPrevious: boolean = false) {
		this.selectedPhysicianInCurrentPage = [];
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		if (this.subscribed === true || page === 1) {
			this.page = page;
			// window.scrollTo({top: 0, behavior: 'smooth'});
			this.loaderService.display(true);
			this.offset = this.limit * (page - 1);
			if (isPrevious) {
				//We are taking the offset based on page number
				this.previousOffsets.splice(this.previousOffsets.length - 2, 2);
				this.previousSavedOffsets.splice(this.previousOffsets.length - 2, 2);
			}
			this.setPhysicianSearchParams();
			this.amplizService.searchPhysician(this.physicianSearchParameter).subscribe(
				(res) => {
					this.loaderService.display(false);
					this.unLockDiv = false;
					this.totalSearchResult = res.physicianInfoList;
					//We are adding offset to that array

					this.previousOffsets.push(res.offset);
					this.previousSavedOffsets.push(res.savedListOffset);
					if (this.totalSearchResult.length !== 0) {
						this.noResult = false;
						this.selectedPhysicianInCurrentPage = this.totalSearchResult
							.filter((contactItem: any) => {
								return this.selectedPhysician.includes(contactItem.physicianId);
							})
							.map((item: any) => item.physicianId);
						this.savedPhysicians = this.totalSearchResult.filter((contactItem: any) => {
							return contactItem.leadSaveStatus == 'Saved';
						});
						this.totalCount = res.totalResult;
						if (this.tab === 1) {
							this.totalSize = res.totalResult;
						}
						if (this.tab === 2) {
							this.totalSize = this.netNewCount;
						}
						this.pager = this.pagerservice.getPager(this.totalSize, page, this.limit);
						this.pagedItems = this.totalSearchResult.slice(this.pager.startIndex, this.pager.endIndex + 1);
						this.getNetNewCount();
					} else {
						this.noResult = true;
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

	refreshedData(ev: any) {
		//
		if (ev === true) {
			this.setPage(1);
			this.getNetNewCount();
		}
	}

	handleIndividualCheckboxChange(value, item) {
		this.handleCheckboxChangeForAll(item);
		this.handleCurrentCheckboxChange(item);
	}
	checkSelectAll(val) {
		this.selectedPhysician = this.selectedPhysician.filter(
			(item) => !this.selectedPhysicianInCurrentPage.includes(item)
		);
		this.selectedPhysicianInCurrentPage = [];
		if (val == true) {
			this.totalSearchResult.map((contact: any) => {
				// if (!contact.inSavedList) {
				this.handleCheckboxChangeForAll(contact);
				this.handleCurrentCheckboxChange(contact);
				// }
			});
		}
	}

	handleCurrentCheckboxChange(contact) {
		const currentContactsIndex = this.selectedPhysicianInCurrentPage.indexOf(contact.physicianId);
		if (currentContactsIndex == -1) {
			if (contact.leadSaveStatus !== 'Saved') {
				this.selectedPhysicianInCurrentPage.push(contact.physicianId);
			}
		} else {
			this.selectedPhysicianInCurrentPage.splice(currentContactsIndex, 1);
		}
	}

	//Handling checkbox change for selection in current page
	handleCheckboxChangeForAll(contact) {
		const contactsIndex = this.selectedPhysician.findIndex((item) => item == contact.physicianId);
		// console.log(contactsIndex, this.selectedPhysician,"contactsIndex")
		if (contactsIndex == -1) {
			if (contact.leadSaveStatus !== 'Saved') {
				this.selectedPhysician.push(contact.physicianId);
			}
		} else {
			this.selectedPhysician.splice(contactsIndex, 1);
		}
	}

	handleRecordsChange() {
		this.offset = 0;
		this.previousOffsets = [0];
		this.previousSavedOffsets = [0];
		this.setPage(1);
	}
	storeFilterData() {
		this.filterStorageService.set('physician_leadWithEmail', this.leadWithEmail);
	}
	getPersistData() {
		this.leadWithEmail = this.filterStorageService.get('executive_leadWithEmail') || false;
	}
}
