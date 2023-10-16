import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
	@ViewChild('cptCodeInput', { static: false })
	cptCodeInput: ElementRef<HTMLInputElement>;
	selectable = true;
	removable = true;

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
	imagingEqupmentsList: Array<any> = [];
	cptControl = new FormControl();

	constructor(
		private b2bService: ImagingService,
		private filterStorageService: FilterStorageService,
		private dataService: ImagingDataService
	) {}
	get selectedImagingEquipments() {
		return this.filterData.imagingEquipments;
	}

	ngOnInit() {
		this.getPersistData();
		this.makeImagingEqipmentList();
		this.getAllListData();
		this.getImagingCenterEquipment();

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
	getAllListData() {
		this.cptControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv) {
				this.getImagingCenterEquipment(hv);
			}
		});
	}

	getPersistData() {
		// let that = this;
		setTimeout(() => {
			this.filterData.centerName = this.filterStorageService.get('imaging_centerName') || [];

			this.filterData.stateList = this.filterStorageService.get('imaging_selectedStates') || [];
			this.filterData.cityList = this.filterStorageService.get('imaging_selectedCities') || [];
			this.selectedCountry = this.filterStorageService.get('imaging_selectedCountry') || [];
			this.filterData.noOfEqupment = this.filterStorageService.getNumber('imaging_noOfEqupment') || 0;
			if (this.filterData.noOfEqupment) {
				this.selectedImagingNumber[0] = this.filterData.noOfEqupment;
			}
			this.filterData.imagingEquipments =
				this.filterStorageService.get('imaging_executive_imagingEquipments') || [];
			// setTimeout(() => {
			this.omitChanges();
		});
	}

	storeFilterData() {
		this.filterStorageService.set('imaging_centerName', this.filterData.centerName);

		this.filterStorageService.set('imaging_selectedStates', this.filterData.stateList);
		this.filterStorageService.set('imaging_selectedCities', this.filterData.cityList);

		this.filterStorageService.setNumberOrString('imaging_noOfEqupment', this.filterData.noOfEqupment);
		this.filterStorageService.set('imaging_executive_imagingEquipments', this.filterData.imagingEquipments);
	}

	omitChanges() {
		this.onFilterChange.emit(this.filterData);
		this.storeFilterData();
	}

	clearFilter() {
		const isValid = this.filterData.validateImagingSearch();
		this.cptCodeInput.nativeElement.value = '';
		this.selectedImagingNumber = [];
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
	getImagingCenterEquipment(searchPhase = '') {
		this.b2bService.getImagingCenterEquipment(searchPhase).subscribe((res) => {
			this.imagingEqupmentsList = res.icEquipmentList;
		});
	}
	removeCode(code: string) {
		this.filterData.imagingEquipments = this.filterData.imagingEquipments.filter((el) => el !== code);
		this.getImagingCenterEquipment();
		this.omitChanges();
		this.storeFilterData();
	}
	onCodeSelect(event: MatAutocompleteSelectedEvent) {
		this.filterData.imagingEquipments = [
			...new Set([...this.filterData.imagingEquipments, event.option.value])
		];
		this.cptCodeInput.nativeElement.value = '';
		setTimeout(() => {
			this.getImagingCenterEquipment();
		}, 500);
		this.omitChanges();
		this.storeFilterData();
	}
}
