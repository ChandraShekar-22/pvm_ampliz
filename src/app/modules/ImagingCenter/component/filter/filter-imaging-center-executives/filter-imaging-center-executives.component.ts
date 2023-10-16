import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { FilterStorageService } from 'src/app/modules/B2B/services/filter-storage.service';
import { SearchImagingExecutivesModel } from '../../../models/SearchImagingExecutivesModel';
import { ImagingDataService } from '../../../services/imaging-data.service';
import { ImagingService } from '../../../services/imaging.service';

@Component({
	selector: 'app-filter-imaging-center-executives',
	templateUrl: './filter-imaging-center-executives.component.html',
	styleUrls: ['./filter-imaging-center-executives.component.css']
})
export class FilterImagingCenterExecutivesComponent implements OnInit {
	@Output() onFilterChange = new EventEmitter<any>();
	@Input() isSubscribed: boolean = false;
	filterData: SearchImagingExecutivesModel = new SearchImagingExecutivesModel();
	//company Variables
	companyList: Array<any> = [];

	//title
	titleList: Array<any> = [];

	// industry

	industryList: Array<any> = [];

	// seniority
	seniorityList: Array<any> = [];

	//department

	departmentList: Array<any> = [];

	//contacts

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
		this.getSeniorityList();
		this.getDepartmentList();
		this.getRevenueList();
		this.makeImagingEqipmentList();
		this.subscription = this.dataService.imagingSearchData.subscribe((res) => {
			if (res.fromSearch) {
				this.filterData = res.data;
				this.omitChanges();
			}
		});
	}

	makeImagingEqipmentList() {
		this.numberOfImagingEquipmentList = [];
		for (let i = 0; i < 25; i++) {
			this.numberOfImagingEquipmentList.push(i + 1);
		}
	}

	ngOnDestroy() {
		if (this.subscription) this.subscription.unsubscribe();
		this.dataService.passSearchImagingInput(this.filterData, false);
	}
	getSeniorityList() {
		this.b2bService.getSeniorityList('').subscribe((res) => {
			this.seniorityList = res.seniorityList;
		});
	}

	getDepartmentList() {
		const body = {
			// searchPhase: '',
			// previouslySearchedTerm: [
			//   ...this.filterData.department
			// ],
		};
		this.b2bService.getDepartmentList(body).subscribe((res) => {
			this.departmentList = res.departmentList;
		});
	}

	getRevenueList() {
		this.filterData.fullName;
		this.b2bService.getRevenueList().subscribe((res) => {
			this.revenueList = res.revenueList;
		});
	}

	// Company functions

	companyValueChanges(item) {
		if (item && item.length > 1) {
			this.b2bService.getCompanyList(item).subscribe((res) => {
				this.companyList = res.companyListImagingCenter;
			});
		}
	}
	// TITLE FUNCTIONS......................

	titleValueChanges(item) {
		if (item && item.length > 1) {
			const body = {
				searchPhrase: item,
				previousSearchedTitle: [...this.filterData.titleInclude, ...this.filterData.titleExclude]
			};
			this.b2bService.getTitlesList(body).subscribe((res) => {
				this.titleList = res.titleAll;
			});
		} else {
			this.titleList = [];
		}
	}
	// INDUSTRY FUNCTIONS......................

	industryValueChanges(item) {
		if (item && item.length > 1) {
			const body = {
				searchPhrase: item
				// previouslySearchedTerm: [
				//   ...this.filterData.industryInclude,
				//   ...this.filterData.industryExclude,
				// ],
			};
			this.b2bService.getIndustryList(body).subscribe((res) => {
				this.industryList = res.industryListImagingCenter;
			});
		} else {
			this.industryList = [];
		}
	}
	// SKILL FUNCTIONS......................

	hanldeLocationValueChange(locationBody: any) {
		this.filterData.cityList = locationBody.city.map((item) => item.city);
		this.filterData.stateList = locationBody.state.map((item) => item.state);
		this.omitChanges();
	}

	// Imaging functions
	imagingNumberSelected() {
		this.selectedImagingNumber[0] = this.imagingNumber;
		this.filterData.numberOfImagingEquipments = this.imagingNumber;
		this.omitChanges();
	}
	removeImagingNumber() {
		this.selectedImagingNumber = [];
		this.imagingNumber = 0;
		this.filterData.numberOfImagingEquipments = 0;
		this.omitChanges();
	}

	getPersistData() {
		// let that = this;
		setTimeout(() => {
			this.filterData.company = this.filterStorageService.get('imaging_includedCompanyList') || [];
			this.filterData.fullName = this.filterStorageService.get('imaging_includedContactsList') || [];
			this.filterData.titleInclude = this.filterStorageService.get('imaging_includedTitleList') || [];
			this.filterData.titleExclude = this.filterStorageService.get('imaging_excludedTitleList') || [];
			this.filterData.industryInclude = this.filterStorageService.get('imaging_includedIndustryList') || [];
			this.filterData.titleExclude = this.filterStorageService.get('imaging_excludedIndustryList') || [];
			this.filterData.seniority = this.filterStorageService.get('imaging_includedSeniorityList') || [];
			this.filterData.department = this.filterStorageService.get('imaging_includedDepartmentList') || [];

			this.filterData.stateList = this.filterStorageService.get('imaging_selectedStates') || [];
			this.filterData.cityList = this.filterStorageService.get('imaging_selectedCities') || [];
			this.selectedCountry = this.filterStorageService.get('imaging_selectedCountry') || [];
			this.filterData.numberOfImagingEquipments =
				this.filterStorageService.getNumber('imaging_numberOfImagingEquipmentList') || 0;
			// setTimeout(() => {
			this.omitChanges();
		});
	}

	storeFilterData() {
		this.filterStorageService.set('imaging_includedCompanyList', this.filterData.company);
		this.filterStorageService.set('imaging_includedContactsList', this.filterData.fullName);
		this.filterStorageService.set('imaging_includedTitleList', this.filterData.titleInclude);
		this.filterStorageService.set('imaging_excludedTitleList', this.filterData.titleExclude);
		this.filterStorageService.set('imaging_includedIndustryList', this.filterData.industryInclude);
		this.filterStorageService.set('imaging_excludedIndustryList', this.filterData.industryExclude);
		this.filterStorageService.set('imaging_includedSeniorityList', this.filterData.seniority);
		this.filterStorageService.set('imaging_includedDepartmentList', this.filterData.department);
		this.filterStorageService.set('imaging_selectedStates', this.filterData.stateList);
		this.filterStorageService.set('imaging_selectedCities', this.filterData.cityList);
		this.filterStorageService.set('imaging_selectedCountry', this.selectedCountry);
		this.filterStorageService.setNumberOrString(
			'imaging_numberOfImagingEquipmentList',
			this.filterData.numberOfImagingEquipments
		);
	}

	omitChanges() {
		this.onFilterChange.emit(this.filterData);
		this.storeFilterData();
	}

	clearFilter() {
		const isValid = this.filterData.validateImagingSearch();
		if (isValid) {
			this.filterData = new SearchImagingExecutivesModel();
			this.omitChanges();
		}
	}
}
