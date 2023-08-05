import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { PayorService } from 'src/app/modules/payor/service/payor.service';
import { SearchImagingExecutivesModel } from 'src/app/modules/ImagingCenter/models/SearchImagingExecutivesModel';
import { ImagingDataService } from 'src/app/modules/ImagingCenter/services/imaging-data.service';
import { ImagingService } from 'src/app/modules/ImagingCenter/services/imaging.service';
import { PayorExecutive, PayorExecutiveList } from '../../models/payor-executive.model';
import { DataService } from '../../service/data.service';
import { SearchPayorExecutive } from '../../models/search-payor-executive.model';

@Component({
	selector: 'app-payor-executive',
	templateUrl: './payor-executive.component.html',
	styleUrls: ['./payor-executive.component.css']
})
export class PayorExecutiveComponent implements OnInit {
	showLoader: boolean = true;
	tabItems = [
		{ name: `Total (0)`, icon: { name: '' } },
		{ name: `Net New (0)`, icon: { name: '' } }
	];

	offset: number = 0;
	currentTab: number = 0;
	totalItemCount: number = 0;
	pageNumberOptions: Array<any> = [5, 10, 25, 50];
	previousOffsets: Array<any> = [];
	previousSavedOffsets: Array<any> = [];
	isSubscribed: any = true;
	selectedFilter: SearchPayorExecutive = new SearchPayorExecutive();
	imagingList: PayorExecutiveList = new PayorExecutiveList();
	savedImagings: Array<any> = [];
	selectedImagings: Array<any> = [];
	selectedImagingsInCurrentPage: Array<any> = [];
	noResult: boolean = false;
	showUpgradeCard: boolean = false;
	subscribed: boolean = false;
	netNewCount: number = 0;

	constructor(
		private imagingService: ImagingService,
		private dataService: DataService,
		private amplizService: AmplizService,
		private payorService: PayorService
	) {}

	ngOnInit() {
		this.dataService.savedPayor.subscribe((res: Array<PayorExecutive>) => {
			this.imagingList.updateImagingssListFromSavedList(res);
			if (res.length > 0) {
				this.getNetNewCount();
			}
		});
		this.getLists();
		this.getDashboardDetails();
	}
	ngOnDestroy(): void {}
	dateChanged(event) {}

	get paginationEndCount() {
		const count = this.selectedFilter.searchType == 'TOTAL' ? this.totalItemCount : this.netNewCount;
		return this.offset + this.selectedFilter.limit < count
			? this.offset + this.selectedFilter.limit + 1
			: count;
	}

	get isPartiallySelected() {
		const count = this.selectedFilter.searchType == 'TOTAL' ? this.totalItemCount : this.netNewCount;
		const limit = this.selectedFilter.limit > count ? count : this.selectedFilter.limit;
		return this.selectedImagingsInCurrentPage.length < limit && this.selectedImagingsInCurrentPage.length > 0;
	}
	get allSelected() {
		const count = this.selectedFilter.searchType == 'TOTAL' ? this.totalItemCount : this.netNewCount;
		const limit = this.selectedFilter.limit > count ? count : this.selectedFilter.limit;
		return this.selectedImagingsInCurrentPage.length >= limit && !this.isPartiallySelected;
	}

	handleRecordsChange() {
		this.selectedFilter.offset = 0;
		// this.selectedFilter.savedListOffset = 0;
		this.previousOffsets = [0];
		this.previousSavedOffsets = [0];

		this.searchImagingsList();
		this.offset = 0;
	}

	async searchImagingsList(updatePreviousOffsets: boolean = true) {
		this.showLoader = true;
		if (updatePreviousOffsets) {
			this.selectedFilter.offset = this.previousOffsets[this.previousOffsets.length - 1] || 0;
			this.selectedFilter.savedListOffset = this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;
		}

		await this.getNetNewCount();
		this.payorService
			.searchMCOExecutives({
				...this.selectedFilter,
				industry: this.selectedFilter.industry ? this.selectedFilter.industry : []
			})
			.subscribe(
				(res) => {
					this.showLoader = false;
					this.dataService.addToSavedLTC([]);
					if (updatePreviousOffsets) {
						this.previousOffsets.push(res.offset);
						this.previousSavedOffsets.push(res.savedListOffset);
					}
					this.imagingList.payorExecutiveInfoList = res.mcoExecutiveInfoList;
					this.selectedImagingsInCurrentPage = this.imagingList.payorExecutiveInfoList
						.filter((imagingItem: any) => {
							return this.selectedImagings.includes(imagingItem.mcoExecutiveId);
						})
						.map((item: any) => item.mcoExecutiveId);
					this.totalItemCount = res.totalResult;
					this.changeTabItems();
					this.savedImagings = this.imagingList.payorExecutiveInfoList.filter((imageItem: any) => {
						return imageItem.leadSaveStatus == 'Saved';
					});
					if (this.imagingList.payorExecutiveInfoList.length !== 0) {
						this.noResult = false;
					} else {
						this.noResult = true;
					}
				},
				(err) => {
					console.log(err, 'searchMCOExecutives');
					this.imagingList.payorExecutiveInfoList = [];
					this.showLoader = false;
					this.noResult = true;
				}
			);
	}

	get decrementEnabled() {
		return this.offset > 0;
	}

	getNetNewCount() {
		this.payorService
			.searchMCOExecutivesCount({
				...this.selectedFilter,
				industry: this.selectedFilter.industry ? this.selectedFilter.industry : []
			})
			.subscribe(
				(netnew) => {
					this.netNewCount = netnew.netNew || 0;
					this.changeTabItems();
				},
				(err) => {}
			);
	}

	decrementPage() {
		if (this.decrementEnabled) {
			this.showUpgradeCard = false;
			this.previousOffsets.splice(this.previousOffsets.length - 2, 2);
			this.previousSavedOffsets.splice(this.previousSavedOffsets.length - 2, 2);
			this.selectedImagingsInCurrentPage = [];
			this.selectedFilter.offset = this.selectedFilter.offset - this.selectedFilter.limit;
			this.offset = this.offset - this.selectedFilter.limit;
			this.searchImagingsList();
		}
	}

	get incrementEnabled() {
		return this.offset + this.selectedFilter.limit < this.totalItemCount && !this.showUpgradeCard;
	}

	incrementPage() {
		if (this.incrementEnabled) {
			if (this.subscribed) {
				this.showUpgradeCard = false;
				this.selectedImagingsInCurrentPage = [];
				this.selectedFilter.offset = this.selectedFilter.offset + this.selectedFilter.limit;
				this.offset = this.offset + this.selectedFilter.limit;

				this.searchImagingsList();
			} else {
				this.showUpgradeCard = true;
				this.offset = this.offset + this.selectedFilter.limit;
				this.selectedFilter.offset = this.offset;
			}
		}
	}

	clearSave() {
		this.selectedImagingsInCurrentPage = [];
		this.selectedImagings = [];
	}

	handleSelectVisible(event) {
		this.selectedImagings = this.selectedImagings.filter(
			(item) => !this.selectedImagingsInCurrentPage.includes(item)
		);
		this.selectedImagingsInCurrentPage = [];
		if (event == true) {
			this.imagingList.payorExecutiveInfoList.map((imaging: any) => {
				this.handleCheckboxChangeForAll(imaging);
				this.handleCurrentCheckboxChange(imaging);
			});
		}
	}
	handleCheckboxChange(event, imaging) {
		this.handleCheckboxChangeForAll(imaging);
		this.handleCurrentCheckboxChange(imaging);
	}

	//Handling checkbox change for all selection
	handleCurrentCheckboxChange(imaging) {
		const currentimagingsIndex = this.selectedImagingsInCurrentPage.indexOf(imaging.mcoExecutiveId);
		if (currentimagingsIndex == -1) {
			if (imaging.leadSaveStatus !== 'Saved') {
				this.selectedImagingsInCurrentPage.push(imaging.mcoExecutiveId);
			}
		} else {
			this.selectedImagingsInCurrentPage.splice(currentimagingsIndex, 1);
		}
	}

	//Handling checkbox change for selection in current page
	handleCheckboxChangeForAll(imaging) {
		const imagingsIndex = this.selectedImagings.findIndex((item) => item == imaging.mcoExecutiveId);
		if (imagingsIndex == -1) {
			if (imaging.leadSaveStatus !== 'Saved') {
				this.selectedImagings.push(imaging.mcoExecutiveId);
			}
		} else {
			this.selectedImagings.splice(imagingsIndex, 1);
		}
	}

	peopleCheckboxDisabled(item) {
		return item.leadSaveStatus == 'Saved' || !this.subscribed;
	}
	changeTabItems() {
		this.tabItems[0].name = `Total (${this.numberWithCommas(this.totalItemCount)})`;
		this.tabItems[1].name = `Net New (${this.numberWithCommas(this.netNewCount)})`;
	}

	numberWithCommas(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	handleTabChange(event) {
		this.currentTab = event;
		if (event == 0) {
			this.selectedFilter.searchType = 'TOTAL';
		} else {
			this.selectedFilter.searchType = 'NETNEW';
		}
		this.selectedFilter.offset = 0;
		this.offset = 0;
		// this.selectedFilter.savedListOffset = 0;

		// this.currentItemNumber = 0;
		this.previousOffsets = [0];
		this.previousSavedOffsets = [0];
		this.searchImagingsList();
	}

	getLists() {
		this.imagingService.getLists(0, 100, false).subscribe((res) => {
			this.dataService.changeApacList(res.savedlistInfoList);
		});
	}

	handleImagingAddList() {
		this.selectedImagings = [];
		this.selectedImagingsInCurrentPage = [];

		this.searchImagingsList(false);
	}

	async handleFilterChanged(event: SearchPayorExecutive) {
		this.selectedFilter = event;
		this.previousOffsets = [0];
		this.previousSavedOffsets = [0];
		this.offset = 0;
		await this.saveDraftLeads();
		this.searchImagingsList();
	}
	saveDraftLeads() {
		this.imagingService.saveDraftLeads().subscribe(
			(res) => {},
			(err) => {}
		);
	}

	async getDashboardDetails() {
		const authToken = await localStorage.getItem('auth_token');
		const refreshToken = await localStorage.getItem('refresh_token');
		if (authToken !== null && refreshToken !== null) {
			this.amplizService.getDashboardDetails().subscribe(
				(res) => {
					let subscriptions = res.Subscriptions;
					if (subscriptions[0].SubscriptionType == 'Free') {
						localStorage.setItem('SubscriptionisActive', 'false');
						this.subscribed = false;
					}
					if (subscriptions[0].SubscriptionType == 'Paid') {
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
}
