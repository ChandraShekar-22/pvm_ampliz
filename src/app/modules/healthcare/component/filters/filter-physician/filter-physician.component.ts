import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Output,
	EventEmitter,
	Input,
	OnChanges,
	NgZone,
	Renderer2
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FilterStorageService } from '../../../services/filter-storage.service';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
@Component({
	selector: 'app-filter-physician',
	templateUrl: './filter-physician.component.html',
	styleUrls: ['./filter-physician.component.css']
})
export class FilterPhysicianComponent implements OnInit, AfterViewInit, OnChanges {
	@Output() onFilterChange = new EventEmitter<any>();
	@Input() isSubscribed: boolean;
	@Input() leadWithEmail: boolean = false;
	emailTypeIsp: boolean = false;
	selectable = true;
	removable = true;
	@ViewChild('hospitalNameInput', { static: false })
	hospitalNameInput: ElementRef<HTMLInputElement>;
	@ViewChild('npiNumberInput', { static: false })
	npiNumberInput: ElementRef<HTMLInputElement>;
	@ViewChild('experienceInput', { static: false })
	experienceInput: ElementRef<HTMLInputElement>;
	@ViewChild('stateInput', { static: false })
	stateInput: ElementRef<HTMLInputElement>;
	@ViewChild('cityInput', { static: false })
	cityInput: ElementRef<HTMLInputElement>;
	@ViewChild('includeSpecialityInput', { static: false })
	includeSpecialityInput: ElementRef<HTMLInputElement>;
	@ViewChild('excludeSpecialityInput', { static: false })
	excludeSpecialityInput: ElementRef<HTMLInputElement>;
	@ViewChild('emailStatusInput', { static: false })
	emailStatusInput: ElementRef<HTMLInputElement>;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	hospitalControl = new FormControl();
	stateControl = new FormControl();
	cityControl = new FormControl();
	npiNumberControl = new FormControl();
	experienceControl = new FormControl();
	includeSpecialityControl = new FormControl();
	excludeSpecialityControl = new FormControl();
	emailStatusControl = new FormControl();
	hideHospitalNamePlaceholder: boolean = false;
	// Data for filter component
	filteredHospitals: Observable<string[]>;
	filteredStates: Observable<string[]>;
	stateList: any = [];
	filteredCities: any = [];
	filteredSpeciality: any = [];
	filteredSpecialityEx: any = [];
	// Variable to be used for filter API call
	includedSpecialities: any = [];
	excludedSpecialities: any = [];
	emailStatus: number = 0;
	physicianName: string = '';
	hospitalNames: any = [];
	selectedStates: any = [];
	selectedCities: any = [];
	searchCity: any = [];
	npiNumberList: any = [];
	experienceList: any = [];
	npiNumbers: any = [];
	experience: any = [];
	suggestionTerms: any = [];
	suggestionTermsEx: any = [];
	isPaid: boolean = false;
	provider_Type: any;
	leadWithProvider: boolean = false;
	constructor(
		private amplizService: AmplizService,
		private filterStorageService: FilterStorageService,
		private ngZone: NgZone,
		public router: Router,
		private healthCareDataService: DataService,
		private loaderService: LoaderService,
		private messageService: MessageService,
		private renderer: Renderer2,
		private elementRef: ElementRef
	) {}
	get localstorageHospitalName() {
		return window.localStorage.getItem('hospitalName') || '';
	}

	ngOnInit() {
		// this.getPersistData();
		this.getAllListData();
	}
	ngAfterViewInit() {
		if (this.localstorageHospitalName) {
			this.hospitalNames.push(this.localstorageHospitalName);
			window.localStorage.removeItem('hospitalName');
		}
		this.getPersistData();
	}
	ngOnChanges() {
		this.isPaid = !this.isSubscribed;
		this.changeSearchData();
		// this.isPaid = false;
		//
	}
	getPersistData() {
		setTimeout(() => {
			this.hospitalNames = this.filterStorageService.get('physician_hospital') || [];
			this.emailStatus = this.filterStorageService.get('email_Score') || 0;
			this.includedSpecialities = this.filterStorageService.get('physician_specialityIncluded') || [];
			this.excludedSpecialities = this.filterStorageService.get('physician_specialityExcluded') || [];
			this.physicianName = this.filterStorageService.get('physician_physicianName') || '';
			this.selectedCities = this.filterStorageService.get('physician_cityList') || [];
			this.selectedStates = this.filterStorageService.get('physician_stateList') || [];
			this.npiNumbers = this.filterStorageService.get('physician_npiNumber') || [];
			this.experience = this.filterStorageService.get('physician_experience') || [];
			this.leadWithEmail = this.filterStorageService.get('physician_leadWithEmail') || false;
			this.leadWithProvider = this.filterStorageService.get('physician_providerType') || false;
			this.emailTypeIsp = this.filterStorageService.get('emailTypeIsp') || false;
			if (
				this.hospitalNames.length > 0 ||
				this.includedSpecialities.length > 0 ||
				this.excludedSpecialities.length > 0 ||
				this.physicianName !== '' ||
				this.selectedCities.length > 0 ||
				this.selectedStates.length > 0 ||
				this.npiNumbers.length > 0 ||
				this.experience.length > 0 ||
				this.leadWithEmail !== false ||
				this.leadWithProvider !== false ||
				this.emailStatus !== undefined ||
				this.emailTypeIsp !== false
			) {
				this.omitChange();
			}
		});
	}
	get getExperienceList() {
		return this.experienceList;
	}
	// addNPI(event: MatChipInputEvent): void {
	//   const value = (event.value || "").trim();
	//   let found = this.npiNumbers.filter((ele) => ele.name === value);
	//   const index = this.npiNumbers.indexOf(value);
	//   if (value && found.length === 0) {
	//     this.npiNumbers.push({ name: value });
	//     // this.persist("npiNumbers", this.npiNumbers);
	//     event.input.value = "";
	//   }
	// }
	onCitySelect(city: any) {
		//
		// this.selectedCities.push(city);
		// this.omitChange();

		const found = this.selectedCities.findIndex((ele) => ele.cityId === city.cityId);

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
	}
	onCityDeselect(city: any) {
		this.selectedCities = this.selectedCities.filter((ele) => ele.cityId !== city.cityId);
		this.omitChange();
	}
	public openItem(path: string): void {
		this.ngZone.run(() => this.router.navigateByUrl(path)).then();
	}
	onNPISelect(npi: any) {
		const found = this.npiNumbers.findIndex((ele) => ele === npi);
		if (found !== -1) {
			this.npiNumbers = this.npiNumbers.filter((ele) => ele !== npi);
			this.npiNumberInput.nativeElement.value = '';
			this.npiNumberControl.setValue(null);
		} else {
			this.npiNumberInput.nativeElement.value = '';
			this.npiNumberControl.setValue(null);
			this.npiNumbers.push(npi);
		}
		this.omitChange();
		this.storeFilterData();
	}
	onExperienceSelect(event: MatAutocompleteSelectedEvent) {
		if (this.experience.findIndex((hospital) => hospital === event.option.viewValue) === -1) {
			this.experience.push(event.option.viewValue);
			this.experienceInput.nativeElement.value = '';
			this.experienceControl.setValue(null);
			const temp: any = [];
			this.experienceList = temp;
			this.omitChange();
			this.storeFilterData();
		}
	}
	// selectNPI(event: MatAutocompleteSelectedEvent): void {
	//   this.npiNumbers.push(event.option.viewValue);
	//   this.npiNumberInput.nativeElement.value = "";
	//   this.npiNumberControl.setValue(null);
	//   this.omitChange();
	// }
	removeNPI(content): void {
		this.npiNumbers = this.npiNumbers.filter((ele) => ele !== content);
		this.npiNumberList = [];
		this.omitChange();
		this.storeFilterData();
	}
	removeExperience(content): void {
		this.experience = this.experience.filter((ele) => ele !== content);
		this.experienceList = [];
		this.omitChange();
		this.storeFilterData();
	}
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

	storeFilterData() {
		this.filterStorageService.set('physician_hospital', this.hospitalNames);
		this.filterStorageService.set('physician_experience', this.experience);
		this.filterStorageService.set('physician_specialityIncluded', this.includedSpecialities);
		this.filterStorageService.set('physician_specialityExcluded', this.excludedSpecialities);
		this.filterStorageService.set('physician_physicianName', this.physicianName);
		this.filterStorageService.set('physician_cityList', this.selectedCities);
		this.filterStorageService.set('physician_stateList', this.selectedStates);
		this.filterStorageService.set('physician_npiNumber', this.npiNumbers);
		this.filterStorageService.set('physician_leadWithEmail', this.leadWithEmail);
		this.filterStorageService.set('physician_providerType', this.leadWithProvider);
		this.filterStorageService.set('email_Score', this.emailStatus);
		this.filterStorageService.set('emailTypeIsp', this.emailTypeIsp);
	}
	omitChange() {
		this.onFilterChange.emit({
			hospitalNameList: this.hospitalNames,
			specialityIncluded: this.includedSpecialities,
			specialityExcluded: this.excludedSpecialities,
			physicianName: this.physicianName,
			cityList: this.selectedCities,
			stateList: this.selectedStates,
			npiNumber: this.npiNumbers,
			leadWithEmail: this.leadWithEmail,
			provider_Type: this.leadWithProvider,
			email_Score: this.emailStatus,
			emailTypeIsp: this.emailTypeIsp,
			experience: this.experience
		});
		this.changeSearchData();
	}

	changeSearchData() {
		this.healthCareDataService.changePhysicainSearchData({
			hospitalNameList: this.hospitalNames,
			specialityIncluded: this.includedSpecialities,
			specialityExcluded: this.excludedSpecialities,
			physicianName: this.physicianName,
			cityList: this.selectedCities,
			stateList: this.selectedStates,
			npiNumber: this.npiNumbers,
			leadWithEmail: this.leadWithEmail,
			provider_Type: this.leadWithProvider,
			leadWithPhone: false,
			email_Score: this.emailStatus,
			emailTypeIsp: this.emailTypeIsp,
			experience: this.experience
		});
	}
	removeHospital(val: any): void {
		this.hospitalNames = this.hospitalNames.filter((name) => name !== val);
		const temp: any = [];
		this.filteredHospitals = temp;
		this.omitChange();
		this.storeFilterData();
	}
	addIncludeSpeciality(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		const found = this.includedSpecialities.indexOf(value);
		// Add our fruit
		if (value && found === -1) {
			this.includedSpecialities.push(value);
			// Clear the input value
			event.input.value = '';
		}
		this.omitChange();
		this.storeFilterData();
		this.getSpecialitySimilarTerms(event.value);
	}
	addExcludeSpeciality(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		const found = this.excludedSpecialities.indexOf(value);
		// Add our fruit
		if (value && found === -1) {
			this.excludedSpecialities.push(value);
			// Clear the input value
			event.input.value = '';
		}
		this.omitChange();
		this.storeFilterData();
		this.getSpecialitySimilarTerms(event.value, false);
	}
	selectedIncludeSpeciality(event: MatAutocompleteSelectedEvent): void {
		this.includedSpecialities.push(event.option.viewValue);
		this.includeSpecialityInput.nativeElement.value = '';
		this.includeSpecialityControl.setValue(null);
		this.suggestionTerms = this.suggestionTerms.filter((st) => st !== event.option.viewValue);
		this.suggestionTermsEx = this.suggestionTermsEx.filter((st) => st !== event.option.viewValue);
		this.omitChange();
		this.storeFilterData();
		this.getSpecialitySimilarTerms(event.option.viewValue);
	}
	selectedExcludeSpeciality(event: MatAutocompleteSelectedEvent): void {
		this.excludedSpecialities.push(event.option.viewValue);
		this.excludeSpecialityInput.nativeElement.value = '';
		this.excludeSpecialityControl.setValue(null);
		this.suggestionTerms = this.suggestionTerms.filter((st) => st !== event.option.viewValue);
		this.suggestionTermsEx = this.suggestionTermsEx.filter((st) => st !== event.option.viewValue);
		this.omitChange();
		this.storeFilterData();
		this.getSpecialitySimilarTerms(event.option.viewValue, false);
	}
	termsSelected(val: any) {
		this.suggestionTerms = this.suggestionTerms.filter((st) => st !== val);
		this.suggestionTermsEx = this.suggestionTermsEx.filter((st) => st !== val);
		this.includedSpecialities.push(val);
		this.includeSpecialityInput.nativeElement.value = '';
		this.includeSpecialityControl.setValue(null);
		this.getSpecialitySimilarTerms(val, true);
		this.omitChange();
		this.storeFilterData();
	}
	termsSelectedEx(val: any) {
		this.suggestionTerms = this.suggestionTerms.filter((st) => st !== val);
		this.suggestionTermsEx = this.suggestionTermsEx.filter((st) => st !== val);
		this.excludedSpecialities.push(val);
		this.excludeSpecialityInput.nativeElement.value = '';
		this.excludeSpecialityControl.setValue(null);
		// this.getSpecialitySimilarTerms(val, false);
		this.omitChange();
		this.storeFilterData();
	}
	getSpecialitySimilarTerms(val: any, isIncluded: boolean = true) {
		var preSpeciality = this.includedSpecialities.concat(this.excludedSpecialities);
		this.amplizService
			.getSpecialitySuggestion({
				searchPhrase: val,
				chosenSpecialityList: preSpeciality
			})
			.subscribe((response) => {
				if (response) {
					var tempTerms = [];
					if (response.specialityRelatedTermList.length > 0) {
						tempTerms = response.specialityRelatedTermList.map((s) => {
							var sList = s.specialitySuggestion;
							// for (let i = 0; i < sGroup.length && sList.length < 10; i++) {
							//   const sListEle = sGroup[i].specialityList;
							//   for (let l = 0; l < sListEle.length && sList.length < 10; l++) {
							//     const element = sListEle[l];
							//     sList.push(element);
							//   }
							// }
							return sList;
						});
					}
					if (isIncluded) {
						this.suggestionTerms = tempTerms;
					} else {
						this.suggestionTermsEx = tempTerms;
					}
				} else {
					if (isIncluded) {
						this.suggestionTerms = [];
					} else {
						this.suggestionTermsEx = [];
					}
				}
			});
	}
	removeIncludeSpeciality(val: any): void {
		this.includedSpecialities = this.includedSpecialities.filter((spec) => spec !== val);
		if (this.includedSpecialities.length > 0) {
			var lastE = this.includedSpecialities[this.includedSpecialities.length - 1];
			this.getSpecialitySimilarTerms(lastE, true);
		}
		this.omitChange();
		this.storeFilterData();
		if (this.includedSpecialities.length === 0) {
			this.filteredSpeciality = [];
			this.suggestionTerms = [];
		}
	}
	removeExcludeSpeciality(val: any): void {
		this.excludedSpecialities = this.excludedSpecialities.filter((spec) => spec !== val);
		if (this.includedSpecialities.length > 0) {
			var lastE = this.includedSpecialities[this.includedSpecialities.length - 1];
			this.getSpecialitySimilarTerms(lastE, true);
		}
		this.omitChange();
		this.storeFilterData();
		if (this.excludedSpecialities.length === 0) {
			this.filteredSpecialityEx = [];
			this.suggestionTermsEx = [];
		}
	}
	addPhysicianName(event: any): void {
		this.physicianName = event.target.value;
		if (event.target.value.length >= 3 || event.target.value.length == 0) {
			this.omitChange();
			this.storeFilterData();
		}
	}
	// citySelected(event: MatSelectChange): void {
	//
	//   this.selectedCities.push(event.value[0]);
	//   this.omitChange();
	//   this.storeFilterData();
	// }
	addEmailStatus(event): void {
		if (typeof event.value === 'string') {
			event.value = parseInt(event.value);
		}
		if (event.value !== 0) {
			this.emailStatus = event.value;
			this.emailStatusInput.nativeElement.value = '';
		}
		this.omitChange();
		this.storeFilterData();
	}
	removeEmailStatus() {
		this.emailStatus = 0;

		this.omitChange();
		this.storeFilterData();
	}
	selectedHospitalName(event: MatAutocompleteSelectedEvent): void {
		if (this.hospitalNames.findIndex((hospital) => hospital === event.option.viewValue) === -1) {
			this.hospitalNames.push(event.option.viewValue);
			this.hospitalNameInput.nativeElement.value = '';
			this.hospitalControl.setValue(null);
			const temp: any = [];
			this.filteredHospitals = temp;
			this.omitChange();
			this.storeFilterData();
		}
	}
	selectStates(event: MatAutocompleteSelectedEvent): void {
		const receivedState = event.option.value;
		const found = this.selectedStates.findIndex((ele) => ele.stateId === receivedState.stateId);
		if (found === -1) {
			this.selectedStates.push(receivedState);
			this.stateInput.nativeElement.value = '';
			this.stateControl.setValue(null);

			this.omitChange();
			this.storeFilterData();
			// setTimeout(() => {
			//   this.addCitiesInList(receivedState);
			// }, 200);
		}
	}
	// selectCity(event: MatAutocompleteSelectedEvent): void {
	//   this.selectedCities.push(event.option.value);
	//   this.cityInput.nativeElement.value = "";
	//   this.cityControl.setValue(null);
	//   this.omitChange();
	//   this.storeFilterData();
	//
	// }
	addCitiesInList(state: any) {
		this.amplizService.getCityListForState(state.stateId).subscribe((response) => {
			this.filteredCities = [...this.filteredCities, ...response.cityDataList];
			this.searchCity = this.filteredCities;
			// this.filteredCities.push(response.cityDataList);
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
	}
	// onCityKeyUp(citySearchPhrase: any) {
	//   this.searchCity = this.filteredCities.filter((ele) =>
	//     ele.city.toLocaleLowerCase().includes(citySearchPhrase.toLowerCase())
	//   );
	// }
	clearAll() {
		this.includeSpecialityControl.setValue(null);
		this.includeSpecialityInput.nativeElement.value = '';
		this.excludeSpecialityControl.setValue(null);
		this.excludeSpecialityInput.nativeElement.value = '';
		this.emailStatusControl.setValue(null);
		this.emailStatusInput.nativeElement.value = '';
		this.emailStatusControl.setValue(null);
		this.npiNumberInput.nativeElement.value = '';
		this.experienceInput.nativeElement.value = '';
		this.stateControl.setValue(null);
		this.stateInput.nativeElement.value = '';
		this.stateControl.setValue(null);
		this.stateInput.nativeElement.value = '';
		this.cityControl.setValue(null);
		this.cityInput.nativeElement.value = '';
		this.hospitalNames = [];
		this.includedSpecialities = [];
		this.excludedSpecialities = [];
		this.physicianName = '';
		this.selectedCities = [];
		this.selectedStates = [];
		this.npiNumbers = [];
		this.experience = [];
		this.suggestionTerms = [];
		this.suggestionTermsEx = [];
		this.searchCity = [];
		this.stateList = [];
		this.filteredCities = [];
		this.filteredSpeciality = [];
		this.filteredSpecialityEx = [];
		this.cityControl.setValue(null);
		this.npiNumberList = [];
		this.experienceList = [];
		this.leadWithProvider = false;
		this.leadWithEmail = false;
		this.emailStatus = 0;
		this.omitChange();
		this.storeFilterData();
	}

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
					// this.stateList = response.hospitalDataList;
				});
			} else {
				const tempHospital: any = [];
				this.filteredHospitals = tempHospital;
			}
		});
		// change control for states
		this.stateControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 2) {
				this.amplizService.getStateList({ searchPhase: value }).subscribe((response) => {
					this.filteredStates = response.stateDataList;
				});
			} else {
				const temp: any = [];
				this.filteredStates = temp;
			}
		});
		// change control of NPI
		this.npiNumberControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 1) {
				this.amplizService.getNPINumberList({ searchPhase: value }).subscribe((response) => {
					this.npiNumberList = response.npiNumberList;
				});
			} else {
				const temp: any = [];
				this.npiNumberList = temp;
			}
		});
		this.experienceControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 3) {
				this.amplizService.getExperienceList({ searchPhase: value }).subscribe((response) => {
					this.experienceList = response.experienceList;
				});
			} else {
				const temp: any = [];
				this.experienceList = temp;
			}
		});
		// change control of Include Speciality
		this.includeSpecialityControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 3) {
				var preSpeciality = this.includedSpecialities.concat(this.excludedSpecialities);
				this.amplizService
					.getSpecialityList({
						searchPhrase: value,
						previousSearchSpeciality: preSpeciality
					})
					.subscribe((response) => {
						this.filteredSpeciality = response.specialityAll;
					});
			} else {
				const temp: any = [];
				this.filteredSpeciality = temp;
			}
		});
		// change control of Speciality
		this.excludeSpecialityControl.valueChanges.subscribe((value) => {
			let hv = value !== null ? value : '';
			if (hv.length >= 3) {
				var preSpeciality = this.includedSpecialities.concat(this.excludedSpecialities);
				this.amplizService
					.getSpecialityList({
						searchPhrase: value,
						previousSearchSpeciality: preSpeciality
					})
					.subscribe((response) => {
						this.filteredSpecialityEx = response.specialityAll;
					});
			} else {
				const temp: any = [];
				this.filteredSpecialityEx = temp;
			}
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
	searchCityListForStates(searchPhrase: any) {
		if (searchPhrase.trim().length > 0) {
			//
			var tStates = this.stateList;
			var params = { stateId: tStates, searchPhase: searchPhrase };
			this.amplizService.searchCitiesForStates(params).subscribe((response) => {
				this.filteredCities = [...this.filteredCities, ...response.cityDataList];
				this.searchCity = this.filteredCities;
				// this.filteredCities.push(response.cityDataList);
			});
		}
	}

	handleChange(value, model) {
		if (model === 'emailTypeIsp') {
			this.emailTypeIsp = value;
		} else if (model === 'leadWithPhone') {
		} else if (model === 'Independent') {
			this.provider_Type = value;
		}
		this.omitChange();
		this.storeFilterData();
	}

	// onKey(value) {
	//   this.searchCity = [];
	//   this.selectSearchCity(value);
	// }
	// selectSearchCity(value: string) {
	//   let filter = value.toLowerCase();
	//   this.searchCity = this.filteredCities.filter(
	//     (i) => i.name.toLowerCase().indexOf(filter) >= 0
	//   );
	//   this.omitChange();
	// }

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
