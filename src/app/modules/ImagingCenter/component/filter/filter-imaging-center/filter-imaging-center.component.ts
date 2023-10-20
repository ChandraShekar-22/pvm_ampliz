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
import { tickStep } from 'd3';
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
	@ViewChild('centerName', { static: false })
	centerName: ElementRef<HTMLInputElement>;
	selectable = true;
	removable = true;
	noOfCompanyList = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'11',
		'12',
		'13',
		'14',
		'15',
		'16',
		'17',
		'18',
		'19',
		'20',
		'21',
		'22',
		'23',
		'24',
		'25',
		'26',
		'27',
		'28',
		'29',
		'30',
		'31',
		'32',
		'33',
		'34',
		'35',
		'36',
		'37',
		'38',
		'39',
		'40',
		'41',
		'42',
		'43',
		'44',
		'45',
		'46',
		'48',
		'50',
		'51',
		'52',
		'54',
		'55',
		'56',
		'57',
		'59',
		'60',
		'61',
		'62',
		'63',
		'66',
		'68',
		'69',
		'71',
		'73',
		'74',
		'75',
		'77',
		'78',
		'80',
		'82',
		'83',
		'84',
		'85',
		'86',
		'88',
		'90',
		'92',
		'94',
		'95',
		'96',
		'99',
		'100',
		'101',
		'102',
		'104',
		'108',
		'110',
		'113',
		'114',
		'120',
		'121',
		'126',
		'129',
		'130',
		'132',
		'134',
		'137',
		'141',
		'149',
		'150',
		'151',
		'154',
		'167',
		'168',
		'170',
		'172',
		'179',
		'180',
		'181',
		'198',
		'199',
		'200',
		'201',
		'209',
		'213',
		'222',
		'236',
		'237',
		'240',
		'246',
		'274',
		'276',
		'280',
		'293',
		'308',
		'311',
		'346',
		'349',
		'350',
		'372',
		'376',
		'392',
		'396',
		'400',
		'401',
		'420',
		'433',
		'444',
		'450',
		'476',
		'501',
		'503',
		'526',
		'546',
		'549',
		'559',
		'590',
		'592',
		'629',
		'650',
		'652',
		'668',
		'688',
		'698',
		'741',
		'753',
		'800',
		'2481',
		'273,000'
	];

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
	centerNameController = new FormControl();
	companyCodeModel = '';

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

	// Imaging functions
	imagingNumberSelected() {
		this.selectedImagingNumber[0] = this.imagingNumber;
		this.filterData.noOfEqupment = this.imagingNumber;
		this.storeFilterData();
		this.omitChanges();
	}
	onCompanyCodeSelect() {
		this.filterData.noOfImagingLocation = [
			...new Set([...this.filterData.noOfImagingLocation, this.companyCodeModel])
		];
		this.storeFilterData();
		this.omitChanges();
	}
	get groupSelectedForCenterTab() {
		return [...(this.filterData?.centerName || []), ...(this.filterData?.noOfImagingLocation || [])];
	}
	removeImagingNumber() {
		this.selectedImagingNumber = [];
		this.imagingNumber = 0;
		this.filterData.noOfEqupment = 0;
		this.storeFilterData();
		this.omitChanges();
	}
	removeCompanyCode(code) {
		this.filterData.noOfImagingLocation = this.filterData.noOfImagingLocation.filter((el) => el != code);
		this.companyCodeModel = '';
		this.storeFilterData();
		this.omitChanges();
	}
	getAllListData() {
		this.cptControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv) {
				this.getImagingCenterEquipment(hv);
			}
		});
		this.centerNameController.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv) {
				this.getCenterName(hv);
			}
		});
	}
	getCenterName(searchPhase) {
		this.b2bService.getCompanyList(searchPhase).subscribe((res) => {
			this.companyList = res.companyListImagingCenter;
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
			this.filterData.noOfImagingLocation = this.filterStorageService.get('imaging_noOfImagingLocation') || [];
			// setTimeout(() => {
			this.omitChanges();
		});
	}
	get noOfImagingLocation() {
		return this.filterData.noOfImagingLocation;
	}

	storeFilterData() {
		this.filterStorageService.set('imaging_centerName', this.filterData.centerName);

		this.filterStorageService.set('imaging_selectedStates', this.filterData.stateList);
		this.filterStorageService.set('imaging_selectedCities', this.filterData.cityList);

		this.filterStorageService.setNumberOrString('imaging_noOfEqupment', this.filterData.noOfEqupment);
		this.filterStorageService.set('imaging_executive_imagingEquipments', this.filterData.imagingEquipments);
		this.filterStorageService.set('imaging_noOfImagingLocation', this.filterData.noOfImagingLocation);
	}

	omitChanges() {
		this.onFilterChange.emit(this.filterData);
		this.storeFilterData();
	}

	clearFilter() {
		const isValid = this.filterData.validateImagingSearch();
		this.cptCodeInput.nativeElement.value = '';
		this.selectedImagingNumber = [];
		this.centerName.nativeElement.value = '';
		this.getCenterName('');
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
		this.b2bService.getImagingCenterEquipment(searchPhase, 'Company').subscribe((res) => {
			this.imagingEqupmentsList = res.icEquipmentList;
		});
	}
	removeCode(code: string) {
		this.filterData.imagingEquipments = this.filterData.imagingEquipments.filter((el) => el !== code);
		this.getImagingCenterEquipment();
		this.omitChanges();
		this.storeFilterData();
	}
	removeCenterName(code: string) {
		this.filterData.centerName = this.filterData.centerName.filter((el) => el !== code);
		this.getCenterName('');
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
	get selectedCenterName() {
		return this.filterData.centerName;
	}
	onCenterSelect(event: MatAutocompleteSelectedEvent) {
		this.filterData.centerName = [...new Set([...this.filterData.centerName, event.option.value])];
		this.centerName.nativeElement.value = '';
		setTimeout(() => {
			this.getCenterName('');
		}, 500);
		this.omitChanges();
		this.storeFilterData();
	}
}
