import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { FilterStorageService } from 'src/app/modules/B2B/services/filter-storage.service';
import { SearchImagingModel } from '../../../models/SearchImagingModel';
import { ImagingDataService } from '../../../services/imaging-data.service';
import { ImagingService } from '../../../services/imaging.service';

@Component({
	selector: 'app-filter-imaging-center',
	templateUrl: './filter-imaging-center.component.html',
	styleUrls: ['./filter-imaging-center.component.css']
})
export class FilterImagingCenterComponent implements OnInit, OnDestroy {
	@Output() onFilterChange = new EventEmitter<any>();
	@Input() isSubscribed: boolean = false;
	filterData: SearchImagingModel = new SearchImagingModel();
	//company Variables
	companyList: Array<any> = [];

	//Country Variables
	countryList: Array<any> = [];
	selectedCountry: Array<any> = [];

	//State Variables
	stateList: Array<any> = [];
	selectedStates: Array<any> = [];

	//City Variables

	//Search List variables
	cityList: Array<any> = [];
	selectedCities: Array<any> = [];

	// Revenue Variables
	revenueList: Array<any> = [];
	includedRevenueRange: any = [];
	subscription: Subscription;

	//Imaging equipments
	numberOfImagingEquipmentList: number[] = [];

	imagingNumber: any = 0;

	selectedImagingNumber: any = [];

	constructor(
		private b2bService: ImagingService,
		private filterStorageService: FilterStorageService,
		private dataService: ImagingDataService
	) {}

	ngOnInit() {
		this.getPersistData();
		this.makeImagingEqipmentList();
		// this.subscription = this.dataService.imagingSearchData.subscribe((res) => {
		//   if (res.fromSearch) {
		//     this.filterData=res.data;
		//     this.omitChanges();
		//   }
		// });
	}

	makeImagingEqipmentList() {
		this.numberOfImagingEquipmentList = [];
		for (let i = 0; i < 25; i++) {
			this.numberOfImagingEquipmentList.push(i + 1);
		}
	}

	ngOnDestroy() {
		if (this.subscription) this.subscription.unsubscribe();
		// this.dataService.passSearchImagingInput(this.filterData, false);
	}

	companyValueChanges(item) {
		if (item && item.length > 1) {
			this.b2bService.getCompanyList(item).subscribe((res) => {
				this.companyList = res.companyListImagingCenter;
			});
		}
	}

	// Imaging functions
	imagingNumberSelected() {
		this.selectedImagingNumber[0] = this.imagingNumber;
		this.filterData.noOfEqupment = this.imagingNumber;
		this.omitChanges();
	}
	removeImagingNumber() {
		this.selectedImagingNumber = [];
		this.imagingNumber = 0;
		this.filterData.noOfEqupment = 0;
		this.omitChanges();
	}

	getPersistData() {
		// let that = this;
		setTimeout(() => {
			this.filterData.centerName = this.filterStorageService.get('imaging_centerName') || [];

			this.filterData.stateList = this.filterStorageService.get('imaging_selectedStates') || [];
			this.filterData.cityList = this.filterStorageService.get('imaging_selectedCities') || [];
			this.selectedCountry = this.filterStorageService.get('imaging_selectedCountry') || [];
			this.filterData.noOfEqupment = this.filterStorageService.getNumber('imaging_noOfEqupment') || 0;
			// setTimeout(() => {
			this.omitChanges();
		});
	}

	storeFilterData() {
		this.filterStorageService.set('imaging_centerName', this.filterData.centerName);

		this.filterStorageService.set('imaging_selectedStates', this.filterData.stateList);
		this.filterStorageService.set('imaging_selectedCities', this.filterData.cityList);

		this.filterStorageService.setNumberOrString('imaging_noOfEqupment', this.filterData.noOfEqupment);
	}

	omitChanges() {
		this.onFilterChange.emit(this.filterData);
		this.storeFilterData();
	}

	clearFilter() {
		const isValid = this.filterData.validateImagingSearch();
		if (isValid) {
			this.filterData = new SearchImagingModel();
			this.omitChanges();
		}
	}
	hanldeLocationValueChange(locationBody: any) {
		this.filterData.cityList = locationBody.city.map((item) => item.city);
		this.filterData.stateList = locationBody.state.map((item) => item.state);
		this.omitChanges();
	}
}
