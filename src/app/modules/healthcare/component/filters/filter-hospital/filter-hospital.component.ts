import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Output,
	EventEmitter,
	Input,
	OnChanges,
	AfterViewInit,
	NgZone,
	Renderer2
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FilterStorageService } from '../../../services/filter-storage.service';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
@Component({
	selector: 'app-filter-hospital',
	templateUrl: './filter-hospital.component.html',
	styleUrls: ['./filter-hospital.component.css']
})
export class FilterHospitalComponent implements OnInit, OnChanges, AfterViewInit {
	typeSettings = {};
	@Output() onFilterChange = new EventEmitter<any>();
	@Input() isSubscribed: boolean;
	selectable = true;
	removable = true;
	@ViewChild('hospitalNameInput', { static: false })
	hospitalNameInput: ElementRef<HTMLInputElement>;
	@ViewChild('codeInput', { static: false })
	codeInput: ElementRef<HTMLInputElement>;
	@ViewChild('stateInput', { static: false })
	stateInput: ElementRef<HTMLInputElement>;
	@ViewChild('cityInput', { static: false })
	cityInput: ElementRef<HTMLInputElement>;
	@ViewChild('input', { static: true }) triggerHospital: MatAutocompleteTrigger;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	hospitalControl = new FormControl();
	codeControl = new FormControl();
	stateControl = new FormControl();
	cityControl = new FormControl();
	hideHospitalNamePlaceholder: boolean = false;
	toppingsControl = new FormControl([]);
	isPaid: boolean = false;
	selectedCode: any[] = [];

	// toppingList: number[] = [
	//   124123456, 124236543, 12435433, 124664433, 1245778877, 124654333,
	// ];

	// Data for filter component
	filteredHospitals: Observable<string[]>;
	filteredStates: Observable<string[]>;
	filteredCities: any = [];
	icptCodeList: any = [];
	hospitalTypeList = [];
	noOfBedList = [];
	// Variable to be used for filter API call
	selectedHospitalTypes: any = [];
	hospitalNames: any = [];
	selectedStates: any = [];
	selectedCities: any = [];
	searchCity: any = [];
	noOfBeds: any = [];
	dropdownSettings = {
		enableCheckAll: false,
		singleSelection: false,
		idField: 'id',
		textField: 'itemName',
		itemsShowLimit: 3,
		allowSearchFilter: true
	};
	constructor(
		public router: Router,
		private amplizService: AmplizService,
		private filterStorageService: FilterStorageService,
		private ngZone: NgZone,
		private healthCareDataService: DataService,
		private loaderService: LoaderService,
		private messageService: MessageService,
		private renderer: Renderer2
	) {}
	ngOnInit() {}
	ngAfterViewInit() {
		this.getCpdtList();
		this.getPersistData();
		this.getAllListData();
	}
	ngOnChanges() {
		// this.isPaid = false;
		this.isPaid = !this.isSubscribed;
	}
	getPersistData() {
		this.hospitalNames = this.filterStorageService.get('hospital_hospital') || [];
		this.selectedHospitalTypes = this.filterStorageService.get('hospital_selectedTypes') || [];
		this.noOfBeds = this.filterStorageService.get('hospital_noOfBeds') || [];
		this.selectedCities = this.filterStorageService.get('hospital_cityList') || [];
		this.selectedStates = this.filterStorageService.get('hospital_stateList') || [];
		this.selectedCode = this.filterStorageService.get('hospital_icdt10Code') || [];

		this.omitChange();
	}
	clearAll() {
		const empty: any = [];
		this.hospitalNames = [];
		this.selectedHospitalTypes = [];
		this.noOfBeds = [];
		this.selectedCities = [];
		this.selectedStates = [];
		this.filteredHospitals = empty;
		this.filteredStates = empty;
		this.filteredCities = [];
		this.hospitalTypeList = [];
		this.cityControl.setValue(null);
		this.noOfBedList = [];
		this.selectedCode = [];
		this.omitChange();
		this.storeFilterData();
	}
	storeFilterData() {
		this.filterStorageService.set('hospital_hospital', this.hospitalNames);
		this.filterStorageService.set('hospital_selectedTypes', this.selectedHospitalTypes);
		this.filterStorageService.set('hospital_noOfBeds', this.noOfBeds);
		this.filterStorageService.set('physician_cityList', this.selectedCities);
		this.filterStorageService.set('physician_stateList', this.selectedStates);
		this.filterStorageService.set('hospital_icdt10Code', this.selectedCode);
	}
	// addNPI(event: MatChipInputEvent): void {
	//   const value = (event.value || "").trim();
	//   let found = this.npiNumber.filter((ele) => ele.name === value);
	//   const index = this.npiNumber.indexOf(value);
	//   if (value && found.length === 0) {
	//     this.npiNumber.push({ name: value });
	//     // this.persist("npiNumber", this.npiNumber);
	//     event.input.value = "";
	//   }
	// }
	// removeNPI(content): void {
	//   const index = this.npiNumber.indexOf(content);
	//   if (index >= 0) {
	//     this.npiNumber.splice(index, 1);
	//     // this.persist("npiNumber", this.npiNumber);
	//   }
	// }
	addHospitalName(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		const found = this.hospitalNames.indexOf(value);
		// Add our fruit
		if (value && found === -1) {
			this.hospitalNames.push(value);
		}
		// Clear the input value
		event.input.value = '';
		// event.input.value = "";
		// event.chipInput!.clear();

		this.hospitalControl.setValue(null);
		this.omitChange();
		this.storeFilterData();
	}
	omitChange() {
		//
		const filterParams = {
			hospitalName: this.hospitalNames,
			hospitalType: this.selectedHospitalTypes,
			numberOFBeds: this.noOfBeds,
			stateList: this.selectedStates,
			city: this.selectedCities,
			icdTenCodes: this.selectedCode
		};
		this.healthCareDataService.changePhysicainSearchData({
			requestType: 'Hospital',
			hospitalName: this.hospitalNames,
			hospitalType: this.selectedHospitalTypes,
			numberOFBeds: this.noOfBeds,
			stateList: this.selectedStates,
			city: this.selectedCities,
			icdTenCodes: this.selectedCode
		});
		// this.filterParams.hospitalType = event.hospitalType;
		// this.filterParams.numberOFBeds = event.numberOFBeds;
		// this.filterParams.city = event.cityList.map((city) => city.city);
		// this.filterParams.specialityIncluded = event.specialityIncluded;
		// this.filterParams.stateList = event.stateList.map((state) => state.state);
		this.onFilterChange.emit(filterParams);
	}
	removeHospital(val: any): void {
		this.hospitalNames = this.hospitalNames.filter((name) => name !== val);
		this.omitChange();
		this.storeFilterData();
	}
	removeCode(val: any): void {
		this.selectedCode = this.selectedCode.filter((name) => name !== val);
		this.omitChange();
		this.storeFilterData();
	}
	// addIncludeSpeciality(event: MatChipInputEvent): void {
	//   const value = (event.value || "").trim();
	//   const found = this.includedSpecialities.indexOf(value);
	//   // Add our fruit
	//   if (value && found === -1) {
	//     this.includedSpecialities.push(value);
	//     // Clear the input value
	//     event.input.value = "";
	//   }
	//   this.omitChange();
	//   // event.input.value = "";
	//   // event.chipInput!.clear();
	// }
	// removeIncludeSpeciality(val: any): void {
	//   this.includedSpecialities = this.includedSpecialities.filter(
	//     (spec) => spec !== val
	//   );
	//   this.omitChange();
	// }
	// addExcludeSpeciality(event: MatChipInputEvent): void {
	//   const value = (event.value || "").trim();
	//   const found = this.excludedSpecialities.indexOf(value);
	//   // Add our fruit
	//   if (value && found === -1) {
	//     this.excludedSpecialities.push(value);
	//     // Clear the input value
	//     event.input.value = "";
	//   }
	//   this.omitChange();
	//   // event.input.value = "";
	//   // event.chipInput!.clear();
	// }
	// addPhysicianName(event: any): void {
	//   if (event.target.value.length >= 3) {
	//     this.physicianName = event.target.value;
	//     this.omitChange();
	//   }
	// }
	onCitySelect(city: any) {
		//
		// this.selectedCities.push(city);
		// this.omitChange();

		const found = this.selectedCities.findIndex((ele) => ele.cityId === city.cityId);
		//
		if (found !== -1) {
			// this.selectedCities = this.selectedCities.filter(
			//   (ele) => ele.cityId !== city.cityId
			// );
		} else {
			this.selectedCities.push(city);
			this.cityInput.nativeElement.value = '';
			this.cityControl.setValue(null);
		}
		this.omitChange();
		this.storeFilterData();
	}
	onCityDeselect(city: any) {
		this.selectedCities = this.selectedCities.filter((ele) => ele.cityId !== city.cityId);
		this.omitChange();
		this.storeFilterData();
	}
	citySelected(event: MatSelectChange): void {
		//
		this.selectedCities.push(event.value[0]);
		this.omitChange();
		this.storeFilterData();
	}
	// removeExcludeSpeciality(val: any): void {
	//   this.excludedSpecialities = this.excludedSpecialities.filter(
	//     (spec) => spec !== val
	//   );
	//   this.omitChange();
	// }
	selectedHospitalName(event: MatAutocompleteSelectedEvent): void {
		if (this.hospitalNames.findIndex((hospital) => hospital === event.option.viewValue) === -1) {
			this.hospitalNames.push(event.option.viewValue);
			this.hospitalNameInput.nativeElement.value = '';
			this.hospitalControl.setValue(null);
			this.omitChange();
			this.storeFilterData();
		}
	}
	selectCode(event: MatAutocompleteSelectedEvent): void {
		if (this.selectedCode.findIndex((hospital) => hospital === event.option.viewValue) === -1) {
			this.selectedCode.push(event.option.value);
			this.codeInput.nativeElement.value = '';
			this.codeControl.setValue(null);
			this.getCpdtList();
			this.omitChange();
			this.storeFilterData();
		}
	}
	onHTOptionClick(HT: any) {
		const found = this.selectedHospitalTypes.findIndex((ele) => ele === HT);
		//
		if (found !== -1) {
			this.selectedHospitalTypes = this.selectedHospitalTypes.filter((hType) => hType !== HT);
		} else {
			this.selectedHospitalTypes.push(HT);
		}
		this.omitChange();
		this.storeFilterData();
	}
	onHospitalTypeSelect(hospitalType: any) {
		this.selectedHospitalTypes.push(hospitalType.value);
		this.omitChange();
		//
	}
	onHospitalTypeDeselect(hospitalType: any) {
		//
		this.selectedHospitalTypes = this.selectedHospitalTypes.filter((hType) => hType !== hospitalType);
		this.omitChange();
		this.storeFilterData();
	}
	onNoOfBedsSelect(bed: any) {
		//
		const found = this.noOfBeds.findIndex((ele) => ele === bed);
		if (found !== -1) {
			this.noOfBeds = this.noOfBeds.filter((b) => b !== bed);
		} else {
			this.noOfBeds.push(bed);
		}
		this.omitChange();
		this.storeFilterData();
	}
	onNoOfBedsDeselect(bed: any) {
		this.noOfBeds = this.noOfBeds.filter((b) => b !== bed);
		this.omitChange();
		this.storeFilterData();
	}
	selectStates(event: MatAutocompleteSelectedEvent): void {
		const receivedState = event.option.value;
		const found = this.selectedStates.findIndex((ele) => ele.stateId === receivedState.stateId);
		if (found === -1) {
			this.selectedStates.push(receivedState);
			this.stateInput.nativeElement.value = '';
			this.stateControl.setValue(null);
			//
			// this.addCitiesInList(receivedState);
			this.omitChange();
			this.storeFilterData();
		}
	}
	selectCity(event: MatAutocompleteSelectedEvent): void {
		this.selectedCities.push(event.option.value);
		this.cityInput.nativeElement.value = '';
		this.cityControl.setValue(null);
		this.omitChange();
		this.storeFilterData();
		//
	}
	addCitiesInList(state: any) {
		//
		this.amplizService.getCityListForState(state.stateId).subscribe((response) => {
			this.filteredCities = [...this.filteredCities, ...response.cityDataList];
			this.searchCity = this.filteredCities;
			// this.filteredCities.push(response.cityDataList);
			//
		});
	}
	removeState(inState: any) {
		this.selectedStates = this.selectedStates.filter((state) => inState.stateId !== state.stateId);
		// this.filteredCities = this.filteredCities.filter(
		//   (city) => city.stateId !== inState.stateId
		// );
		// this.searchCity = this.filteredCities;
		this.omitChange();
		this.storeFilterData();
		//
		//
	}
	onCityKeyUp(citySearchPhrase: any) {
		this.searchCity = this.filteredCities.filter((ele) =>
			ele.city.toLocaleLowerCase().includes(citySearchPhrase.toLowerCase())
		);
	}
	// clearAll() {
	//   //   includedSpeciality: any = [];
	//   // excludedSpeciality: any = [{ name: "Excluded Title" }];
	//   // personName: any = "";
	//   // previousNpiNumber: any = [];
	//   // npiNumber: any = [];
	//   // previousHospitalNames: any = [];
	//   // hospitalName: any = [];
	//   // state: any = "";
	//   // city: any = "";
	//   // this.filterStorageService.remove("includedSpeciality");
	//   // this.filterStorageService.remove("excludedSpeciality");
	//   // this.filterStorageService.remove("npiNumber");
	//   // this.filterStorageService.remove("hospitalName");
	//   // this.filterStorageService.remove("countries");
	//   // this.filterStorageService.remove("personName");
	//   // this.filterStorageService.remove("states");
	//   // this.filterStorageService.remove("cities");
	// }

	displayFn(selectedState: any): string {
		return selectedState.stateId;
	}
	getAllListData() {
		// change control for hospital name
		this.hospitalControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 3) {
				this.amplizService.getHospitalList({ searchPhase: value }).subscribe((response) => {
					this.filteredHospitals = response.hospitalDataList;
				});
			} else {
				const tempHospital: any = [];
				this.filteredHospitals = tempHospital;
			}
		});
		this.codeControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			this.getCpdtList(hv);
		});
		// change control for states
		this.stateControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 2) {
				this.amplizService.getStateList({ searchPhase: value }).subscribe((response) => {
					this.filteredStates = response.stateDataList;
				});
			} else {
				const tempStates: any = [];
				this.filteredStates = tempStates;
			}
		});
		// get hospital type list
		this.amplizService.getHospitalTypeList('').subscribe((res) => {
			this.hospitalTypeList = res.hospitalTypeList;
		});
		// get number of bed  list
		this.amplizService.getNumberOfBedList('').subscribe((res) => {
			this.noOfBedList = res.bedRangeList;
		});
		// city input change
		this.cityControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 3) {
				// event.cityList.map((city) => city.city);
				var tStates = this.selectedStates.map((state) => state.stateId);
				var params = { stateId: tStates, searchPhase: value };
				this.amplizService.searchCitiesForStates(params).subscribe((response) => {
					this.filteredCities = [...response.cityDataList];
					this.searchCity = this.filteredCities;
					// this.filteredCities.push(response.cityDataList);
				});
			} else {
				const temp: any = [];
				this.searchCity = temp;
			}
		});
	}
	getCpdtList(searchPhrase = '') {
		this.amplizService.getAllicdtenCodes({ searchPhrase }).subscribe((response: any) => {
			this.icptCodeList = response.icdtenCodes;
		});
	}
	onKey(value) {
		this.searchCity = [];
		this.selectSearchCity(value);
	}
	selectSearchCity(value: string) {
		let filter = value.toLowerCase();
		this.searchCity = this.filteredCities.filter((i) => i.name.toLowerCase().indexOf(filter) >= 0);
		this.omitChange();
		this.storeFilterData();
	}
	public openItem(path: string): void {
		this.ngZone.run(() => this.router.navigateByUrl(path)).then();
	}
	async requestPricing() {
		const emailId = await localStorage.getItem('email_id');
		this.loaderService.display(true);
		const body = { package: 'Enterprise', email: emailId };
		this.amplizService.getPrice(body).subscribe(
			(res) => {
				this.loaderService.display(false);

				this.messageService.display(true, 'Thanks for asking, will get back to you in 24 hrs');
			},
			(error) => {
				this.loaderService.display(false);
				this.messageService.displayError(true, error.error.msg ? error.error.msg : 'Server Error !!!');
			}
		);
	}
	triggerAutoFocus(eleId: string) {
		const element = this.renderer.selectRootElement(eleId);
		setTimeout(() => element.focus(), 100);
	}
}
