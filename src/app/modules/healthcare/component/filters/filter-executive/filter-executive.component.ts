import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
  OnChanges,
  NgZone,
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { UntypedFormControl } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";

import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { MatSelectChange } from "@angular/material/select";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FilterStorageService } from "../../../services/filter-storage.service";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { DataService } from "../../../services/data.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
@Component({
  selector: "app-filter-executive",
  templateUrl: "./filter-executive.component.html",
  styleUrls: ["./filter-executive.component.css"],
})
export class FilterExecutiveComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() isSubscribed: boolean;
  @Input() leadWithPhone: boolean = false;
  @Input() leadWithEmail: boolean = false;
  selectable = true;
  removable = true;
  @ViewChild("hospitalNameInput")
  hospitalNameInput: ElementRef<HTMLInputElement>;
  @ViewChild("stateInput")
  stateInput: ElementRef<HTMLInputElement>;
  @ViewChild("cityInput")
  cityInput: ElementRef<HTMLInputElement>;
  @ViewChild("includeTitleInput")
  includeTitleInput: ElementRef<HTMLInputElement>;
  @ViewChild("excludeTitleInput")
  excludeTitleInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  hospitalControl = new UntypedFormControl();
  stateControl = new UntypedFormControl();
  cityControl = new UntypedFormControl();
  levelFormControl = new UntypedFormControl();
  titleControl = new UntypedFormControl();
  exTitleControl = new UntypedFormControl();
  hideHospitalNamePlaceholder: boolean = false;
  // Data for filter component
  levelListData: any = [
    { id: 1, level: "C Level" },
    { id: 2, level: "VP Level" },
    { id: 3, level: "Director" },
    { id: 4, level: "Manager" },
    { id: 5, level: "Staff" },
    { id: 6, level: "Others" },
  ];
  filteredStates: Observable<string[]>;
  filteredCities: any = [];
  departmentListData: any = [];
  titleListData: any = [];
  hospitalNames: any = [];
  filteredHospitals: Observable<string[]>;
  // Variable to be used for filter API call
  includedTitles: any = [];
  excludedTitles: any = [];
  personName: string = "";
  selectedLevels: any = [];
  selectedStates: any = [];
  selectedCities: any = [];
  selectedDepartment: any = [];
  selectedTitles: any = [];
  searchCity: any = [];
  isPaid: boolean = false;

  constructor(
    public router: Router,
    private amplizService: AmplizService,
    private filterStorageService: FilterStorageService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private healthCareDataService: DataService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {}

  ngOnChanges() {
    // this.isPaid = false;
    this.isPaid = !this.isSubscribed;
    this.changeSearchData();
  }
  omitChange() {
    const filterData = {
      hospitalNameList: this.hospitalNames,
      titleInclude: this.includedTitles,
      titleExclude: this.excludedTitles,
      levelID: this.selectedLevels,
      department: this.selectedDepartment,
      city: this.selectedCities,
      stateList: this.selectedStates,
      fullName: this.personName,
    };
    this.onFilterChange.emit(filterData);
    this.changeSearchData();
  }
  removeHospital(val: any): void {
    this.hospitalNames = this.hospitalNames.filter((name) => name !== val);
    const temp: any = [];
    this.filteredHospitals = temp;
    this.omitChange();
    this.storeFilterData();
  }
  selectedHospitalName(event: MatAutocompleteSelectedEvent): void {
    if (
      this.hospitalNames.findIndex(
        (hospital) => hospital === event.option.viewValue
      ) === -1
    ) {
      this.hospitalNames.push(event.option.viewValue);
      this.hospitalNameInput.nativeElement.value = "";
      this.hospitalControl.setValue(null);
      const temp: any = [];
      this.filteredHospitals = temp;
      this.omitChange();
      this.storeFilterData();
    }
  }
  changeSearchData() {
    this.healthCareDataService.changePhysicainSearchData({
      hospitalNameList: this.hospitalNames,
      titleInclude: this.includedTitles,
      titleExclude: this.excludedTitles,
      levelID: this.selectedLevels,
      department: this.selectedDepartment,
      city: this.selectedCities,
      stateList: this.selectedStates,
      fullName: this.personName,
      leadWithPhone: this.leadWithPhone,
      zipCode: false,
      leadWithEmail: this.leadWithEmail,
    });
  }

  addIncludeTitle(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    const found = this.includedTitles.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.includedTitles.push(value);
      // Clear the input value
      event.input.value = "";
    }
    this.omitChange();
    this.storeFilterData();
    // event.input.value = "";
    // event.chipInput!.clear();
  }
  removeIncludedTitle(val: any): void {
    this.includedTitles = this.includedTitles.filter((title) => title !== val);
    this.omitChange();
    this.storeFilterData();
  }
  onLevelSelect(lev: any) {
    const found = this.selectedLevels.findIndex(
      (ele) => ele.level === lev.level
    );
    //
    if (found !== -1) {
      this.selectedLevels = this.selectedLevels.filter(
        (ele) => ele.level !== lev.level
      );
    } else {
      this.selectedLevels.push(lev);
    }
    this.omitChange();
    this.storeFilterData();
  }
  onLevelDeselect(lev: any) {
    this.selectedLevels = this.selectedLevels.filter(
      (ele) => ele.level !== lev.level
    );
    this.omitChange();
    this.storeFilterData();
  }
  onDepartmentSelect(dep: any) {
    const found = this.selectedDepartment.findIndex((ele) => ele === dep);
    //
    if (found !== -1) {
      this.selectedDepartment = this.selectedDepartment.filter(
        (ele) => ele !== dep
      );
    } else {
      this.selectedDepartment.push(dep);
    }
    this.omitChange();
    this.storeFilterData();
  }
  onDepartmentDeselect(dep: any) {
    this.selectedDepartment = this.selectedDepartment.filter(
      (ele) => ele !== dep
    );
    this.omitChange();
    this.storeFilterData();
  }
  onCitySelect(city: any) {
    //
    // this.selectedCities.push(city);
    // this.omitChange();

    const found = this.selectedCities.findIndex(
      (ele) => ele.cityId === city.cityId
    );
    //
    if (found !== -1) {
      // this.selectedCities = this.selectedCities.filter(
      //   (ele) => ele.cityId !== city.cityId
      // );
    } else {
      this.selectedCities.push(city);
      this.cityInput.nativeElement.value = "";
      this.cityControl.setValue(null);
    }
    this.omitChange();
    this.storeFilterData();
  }
  onCityDeselect(city: any) {
    this.selectedCities = this.selectedCities.filter(
      (ele) => ele.cityId !== city.cityId
    );
    this.omitChange();
    this.storeFilterData();
  }
  addExcludeTitle(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    //
    const found = this.excludedTitles.indexOf(value);
    if (value && found === -1) {
      this.excludedTitles.push(value);
      // Clear the input value
      event.input.value = "";
    }
    this.omitChange();
    this.storeFilterData();
    // event.input.value = "";
    // event.chipInput!.clear();
  }
  removeExcludedTitle(val: any): void {
    this.excludedTitles = this.excludedTitles.filter((title) => title !== val);
    this.omitChange();
    this.storeFilterData();
  }
  addPersonName(event: any): void {
    this.personName = event.target.value;
    //
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      //
      this.omitChange();
      this.storeFilterData();
    }
  }
  citySelected(event: MatSelectChange): void {
    //
    this.selectedCities.push(event.value[0]);
    this.omitChange();
    this.storeFilterData();
  }
  levelSelected(event: MatSelectChange): void {
    //
    // if (event.value[0] !== undefined) {
    this.selectedLevels = event.value;
    this.omitChange();
    this.storeFilterData();
    // }
  }
  departmentSelected(event: MatSelectChange): void {
    this.selectedDepartment = event.value;
    this.omitChange();
    this.storeFilterData();
  }
  // selectedHospitalName(event: MatAutocompleteSelectedEvent): void {
  //   this.hospitalNames.push(event.option.viewValue);
  //   this.hospitalNameInput.nativeElement.value = "";
  //   this.hospitalControl.setValue(null);
  //   this.omitChange();
  // }
  selectStates(event: MatAutocompleteSelectedEvent): void {
    //
    const receivedState = event.option.value;
    const found = this.selectedStates.findIndex(
      (ele) => ele.stateId === receivedState.stateId
    );
    if (found === -1) {
      this.selectedStates.push(receivedState);
      this.stateInput.nativeElement.value = "";
      this.stateControl.setValue(null);
      //
      // this.addCitiesInList(receivedState);
      this.omitChange();
      this.storeFilterData();
    }
  }
  selectCity(event: MatAutocompleteSelectedEvent): void {
    this.selectedCities.push(event.option.value);
    this.cityInput.nativeElement.value = "";
    this.cityControl.setValue(null);
    this.omitChange();
    //
  }
  addCitiesInList(state: any) {
    //
    this.amplizService
      .getCityListForState(state.stateId)
      .subscribe((response) => {
        this.filteredCities = [
          ...this.filteredCities,
          ...response.cityDataList,
        ];
        this.searchCity = this.filteredCities;
        // this.filteredCities.push(response.cityDataList);
        //
      });
  }
  removeState(inState: any) {
    this.selectedStates = this.selectedStates.filter(
      (state) => inState.stateId !== state.stateId
    );
    // this.filteredCities = this.filteredCities.filter(
    //   (city) => city.stateId !== inState.stateId
    // );
    // this.searchCity = this.filteredCities;
    this.omitChange();
    this.storeFilterData();
  }
  onCityKeyUp(citySearchPhrase: any) {
    this.searchCity = this.filteredCities.filter((ele) =>
      ele.city.toLocaleLowerCase().includes(citySearchPhrase.toLowerCase())
    );
  }
  onLevelKeyUp(level: any) {
    this.selectedLevels = this.selectedLevels.filter((ele) =>
      ele.level.toLocaleLowerCase().includes(level.toLowerCase())
    );
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.getAllListData();
    this.getPersistData();
    this.cdRef.detectChanges();
  }
  getPersistData() {
    this.hospitalNames =
      this.filterStorageService.get("executive_hospital") || [];
    this.includedTitles =
      this.filterStorageService.get("executive_includedTitle") || [];
    this.excludedTitles =
      this.filterStorageService.get("executive_excludedTitle") || [];
    this.selectedLevels =
      this.filterStorageService.get("executive_selectedLevels") || [];
    this.personName =
      this.filterStorageService.get("executive_personName") || "";
    this.selectedDepartment =
      this.filterStorageService.get("executive_department") || [];
    this.selectedCities =
      this.filterStorageService.get("executive_cityList") || [];
    this.selectedStates =
      this.filterStorageService.get("executive_stateList") || [];
    // setTimeout(() => {
    this.omitChange();
    // }, 50);
  }
  clearAll() {
    this.hospitalNames = [];
    this.includedTitles = [];
    this.excludedTitles = [];
    this.selectedLevels = [];
    this.personName = "";
    this.selectedDepartment = [];
    this.selectedCities = [];
    this.selectedStates = [];
    this.filteredStates = of([]);
    this.filteredCities = [];
    // this.departmentListData = [];
    this.searchCity = [];
    this.stateControl.setValue(null);
    this.omitChange();
    this.storeFilterData();
  }
  storeFilterData() {
    this.filterStorageService.set("executive_hospital", this.hospitalNames);
    this.filterStorageService.set(
      "executive_includedTitle",
      this.includedTitles
    );
    this.filterStorageService.set(
      "executive_excludedTitle",
      this.excludedTitles
    );
    this.filterStorageService.set(
      "executive_selectedLevels",
      this.selectedLevels
    );
    this.filterStorageService.set("executive_personName", this.personName);
    this.filterStorageService.set(
      "executive_department",
      this.selectedDepartment
    );
    this.filterStorageService.set("executive_cityList", this.selectedCities);
    this.filterStorageService.set("executive_stateList", this.selectedStates);
  }
  addHospitalName(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    const found = this.hospitalNames.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.hospitalNames.push(value);
    }
    // Clear the input value
    event.input.value = "";
    // event.input.value = "";
    // event.chipInput!.clear();

    this.hospitalControl.setValue(null);
    this.omitChange();
    this.storeFilterData();
  }
  displayFn(selectedState: any): string {
    return selectedState.stateId;
  }
  selectedIncludeTitle(event: MatAutocompleteSelectedEvent): void {
    this.includedTitles.push(event.option.viewValue);
    this.includeTitleInput.nativeElement.value = "";
    this.titleControl.setValue(null);
    this.omitChange();
    this.storeFilterData();
  }
  selectedExIncludeTitle(event: MatAutocompleteSelectedEvent): void {
    this.excludedTitles.push(event.option.viewValue);
    this.excludeTitleInput.nativeElement.value = "";
    this.exTitleControl.setValue(null);
    this.omitChange();
    this.storeFilterData();
  }
  getAllListData() {
    this.amplizService.getDepartmentList(null).subscribe((response) => {
      this.departmentListData = response.departmentList;
    });
    // change control for hospital name
    this.hospitalControl.valueChanges.subscribe((value) => {
      let hv = value !== null ? value : "";
      if (hv.length >= 3) {
        this.amplizService
          .getHospitalList({ searchPhase: value })
          .subscribe((response) => {
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
      let hv = value !== null ? value : "";
      if (hv.length >= 2) {
        this.amplizService
          .getStateList({ searchPhase: value })
          .subscribe((response) => {
            this.filteredStates = response.stateDataList;
          });
      } else {
        const tempStates: any = [];
        this.filteredStates = tempStates;
      }
    });
    // city input change
    this.cityControl.valueChanges.subscribe((value) => {
      let hv = value !== null ? value : "";
      if (hv.length >= 3) {
        // event.cityList.map((city) => city.city);
        var tStates = this.selectedStates.map((state) => state.stateId);
        var params = { stateId: tStates, searchPhase: value };
        this.amplizService
          .searchCitiesForStates(params)
          .subscribe((response) => {
            this.filteredCities = [...response.cityDataList];
            this.searchCity = this.filteredCities;
            // this.filteredCities.push(response.cityDataList);
            //
          });
      } else {
        const temp: any = [];
        this.searchCity = temp;
      }
    });
    // change control for title
    // change control of Include Speciality
    this.titleControl.valueChanges.subscribe((value) => {
      let hv = value !== null ? value : "";
      if (hv.length >= 3) {
        this.amplizService
          .getTitleList({
            searchPhrase: value,
          })
          .pipe(debounceTime(1000))
          .subscribe((response) => {
            var tempTitles = this.includedTitles.concat(this.excludedTitles);
            this.titleListData = response.titleList.filter((title) => {
              //
              return tempTitles.indexOf(title) === -1 ? true : false;
            });
          });
      } else {
        const temp: any = [];
        this.titleListData = temp;
      }
    });
    // change control of Include Speciality
    this.exTitleControl.valueChanges.subscribe((value) => {
      let hv = value !== null ? value : "";
      if (hv.length >= 3) {
        this.amplizService
          .getTitleList({
            searchPhrase: value,
          })
          .pipe(debounceTime(1000))
          .subscribe((response) => {
            var tempTitles = this.includedTitles.concat(this.excludedTitles);
            this.titleListData = response.titleList.filter((title) => {
              //
              return tempTitles.indexOf(title) === -1 ? true : false;
            });
          });
      } else {
        const temp: any = [];
        this.titleListData = temp;
      }
    });
  }
  public openItem(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  public isInList(searchElement, searchFor, searchValue) {
    return searchElement.find((ele) => ele[searchFor] === searchValue);
  }
  async requestPricing() {
    const emailId = await localStorage.getItem("email_id");
    this.loaderService.display(true);
    const body = { package: "Enterprise", email: emailId };
    this.amplizService.getPrice(body).subscribe(
      (res) => {
        this.loaderService.display(false);

        this.messageService.display(
          true,
          "Thanks for asking, will get back to you in 24 hrs"
        );
      },
      (error) => {
        this.loaderService.display(false);
        this.messageService.displayError(
          true,
          error.error.msg ? error.error.msg : "Server Error !!!"
        );
      }
    );
  }
}
