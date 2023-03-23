import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  NgModule,
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { UntypedFormControl } from "@angular/forms";
import { FilterStorageService } from "../../services/filter-storage.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { B2bService } from "../../services/b2b.service";
import { SearchCompanyInput } from "../../models/SearchCompany";
import { DataService } from "../../services/data.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-filter-company",
  templateUrl: "./filter-company.component.html",
  styleUrls: ["./filter-company.component.css"],
  animations: [
    trigger("grow", [
      transition("void <=> *", []),
      transition(
        "* <=> *",
        [
          style({ height: "{{startHeight}}px", opacity: 0 }),
          animate(".5s ease"),
        ],
        { params: { startHeight: 0 } }
      ),
    ]),
  ],
})
export class FilterCompanyComponent implements OnInit, OnDestroy {
  constructor(
    private b2bService: B2bService,
    private filterStorageservice: FilterStorageService,
    private dataService: DataService
  ) {}
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() isSubscribed: boolean;
  selectable = true;
  removable = true;
  selectedPanel = "";
  separatorKeysCodes: number[] = [ENTER, COMMA];
  includeDomainInput: ElementRef<HTMLInputElement>;
  includedEmployeeList: Array<any> = [];

  selectedTitleList: Array<any> = [];
  // includedTitleList: Array<any> = [];
  // excludedTitleList: Array<any> = [];
  includeTitleControl = new UntypedFormControl();
  excludeTitleControl = new UntypedFormControl();
  isCompanyOpened: boolean = false;
  isSkillOpened: boolean = false;
  searchCompanyInput: SearchCompanyInput = new SearchCompanyInput();
  activeFilterCount: number = 0;

  // Employee Variables
  employeeList: Array<any> = [];
  includedEmployeeRange: Array<any> = [];
  avengers = [];

  // Company Variables
  companyListControl = new UntypedFormControl();
  companyList: Array<any> = [];
  includedCompanyList: Array<any> = [];
  recentCompany: Array<any> = [];
  @ViewChild("includeCompanyInput")
  includeCompanyInput: ElementRef<HTMLInputElement>;

  // domain Variables
  domainListControl = new UntypedFormControl();
  domainList: Array<any> = [];
  includedDominList: Array<any> = [];
  recentDomain: Array<any> = [];
  @ViewChild("includedomainInput")
  includedomainInput: ElementRef<HTMLInputElement>;

  // Industry  Variables
  includeIndustryControl = new UntypedFormControl();
  excludeIndustryControl = new UntypedFormControl();
  industryList: Array<any> = [];
  selectedIndustryList: Array<any> = [];
  includedIndustryList: Array<any> = [];
  excludedIndustryList: Array<any> = [];
  recentIncludeIndustry: Array<any> = [];
  recentExcludeIndustry: Array<any> = [];
  @ViewChild("includeIndustryInput")
  includeIndustryInput: ElementRef<HTMLInputElement>;
  @ViewChild("excludeIndustryInput")
  excludeIndustryInput: ElementRef<HTMLInputElement>;

  // Technology Variables
  technologyListControl = new UntypedFormControl();
  technologyList: Array<any> = [];
  includedTechnologyList: Array<any> = [];
  recentTechnology: Array<any> = [];
  @ViewChild("includeTechnologyInput")
  includeTechnologyInput: ElementRef<HTMLInputElement>;

  // Revenue Variables
  revenueList: Array<any> = [];
  includedRevenueRange: Array<any> = [];
  @ViewChild("includeRevenueInput")
  includeRevenueInput: ElementRef<HTMLInputElement>;
  //Country Variables
  countryList: Array<any> = [];
  countryControl: UntypedFormControl = new UntypedFormControl();
  selectedCountry: Array<any> = [];
  @ViewChild("countryInput")
  countryInput: ElementRef<HTMLInputElement>;

  //State Variables
  stateList: Array<any> = [];
  stateControl: UntypedFormControl = new UntypedFormControl();
  selectedStates: Array<any> = [];
  @ViewChild("stateInput")
  stateInput: ElementRef<HTMLInputElement>;

  //City Variables

  cityControl: UntypedFormControl = new UntypedFormControl();
  selectedCities: Array<any> = [];

  //save-search Variables
  searchListDrawer: boolean = false;

  subscription: Subscription;
  searchQuota: number = 1;
  @ViewChild("cityInput")
  cityInput: ElementRef<HTMLInputElement>;
  cityList: any = [];
  ngOnInit() {
    this.getAllFilterDatas();
    this.getEmployeeList();
    this.getRevenueList();
    this.getCountryList();
    this.getRecentValues();
    this.subscription = this.dataService.companySearch.subscribe((res) => {
      if (res.fromSearch) {
        this.makeSearchDatas(res.data);
      }
    });
    this.dataService.searchQuota.subscribe((quota) => {
      this.searchQuota = quota;
    });
  }

  ngOnChanges() {}
  ngAfterViewInit() {
    this.getPersistData();
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    this.dataService.passSearchCompanyInput(this.searchCompanyInput, false);
  }
  getEmployeeList() {
    this.subscription = this.b2bService.getEmployeeList().subscribe((res) => {
      this.employeeList = res.employeeList;
    });
  }

  omitChanges() {
    this.searchCompanyInput.companyList = this.includedCompanyList.map(
      (item) => item.name
    );
    this.searchCompanyInput.domainList = this.includedDominList.map(
      (item) => item.name
    );
    this.searchCompanyInput.employeeRangeList = this.includedEmployeeRange;
    this.searchCompanyInput.revenue = this.includedRevenueRange;
    this.searchCompanyInput.industryInclude = this.includedIndustryList;
    this.searchCompanyInput.industryExclude = this.excludedIndustryList;
    this.searchCompanyInput.techInclude = this.includedTechnologyList.map(
      (item) => item.name
    );
    this.searchCompanyInput.stateList = this.selectedStates.map(
      (state) => state.stateFullName
    );
    this.searchCompanyInput.cityList = this.selectedCities.map(
      (city) => city.city
    );
    this.searchCompanyInput.countryList = this.selectedCountry.map(
      (itm) => itm.country
    );
    this.getActiveFilterCount(this.searchCompanyInput);
    if (this.activeFilterCount > 0) {
      this.b2bService.decreaseQuotaByOne().subscribe((res) => {});
    }
    // ? [this.selectedCountry.countryId]
    // : [];
    this.onFilterChange.emit(this.searchCompanyInput);
    this.storeFilterData();
  }

  makeSearchDatas(searchData: SearchCompanyInput) {
    this.includedCompanyList = searchData.companyList.map((item) => {
      return { name: item };
    });
    this.includedIndustryList = searchData.industryInclude;
    this.excludedIndustryList = searchData.industryExclude;
    this.includedTechnologyList = searchData.techInclude;
    this.includedEmployeeRange = searchData.employeeRangeList;
    searchData.revenue = [...searchData.revenue];
    this.includedRevenueRange = searchData.revenue;
    this.selectedStates = searchData.stateList;
    this.selectedCities = searchData.cityList;
    this.selectedCountry =
      searchData.countryList.length > 0 ? searchData.countryList : [];
    this.omitChanges();
  }

  getRecentValues() {
    this.recentCompany = this.filterStorageservice.get("recentCompany") || [];
    this.recentDomain = this.filterStorageservice.get("recentDomain") || [];
    this.recentIncludeIndustry =
      this.filterStorageservice.get("recentIncludeIndustry") || [];
    this.recentExcludeIndustry =
      this.filterStorageservice.get("recentExcludeIndustry") || [];
    this.recentTechnology =
      this.filterStorageservice.get("recentTechnology") || [];
  }

  clearItems(key, type: any = "array") {
    if (type == "array") {
      this[key] = [];
    } else {
      this[key] = "";
    }
    this.omitChanges();
  }

  removeEmployeeRange(index: number) {
    // console.log(index);
    this.includedEmployeeRange = this.includedEmployeeRange.filter(
      (item, i) => {
        return i != index;
      }
    );
    this.omitChanges();
  }

  getRevenueList() {
    this.b2bService.getRevenueList().subscribe((res) => {
      this.revenueList = res.revenueList;
    });
  }
  getCountryList(value = "") {
    this.b2bService.getCountryList(value).subscribe((res) => {
      this.countryList = res.countryList;
      this.getStateList();
    });
  }

  countrySelected(event) {
    const index = this.selectedCountry.findIndex(
      (item) => item.countryId == event.option.value.countryId
    );
    if (index == -1) {
      this.selectedCountry.push(event.option.value);
    }
    this.getStateList();
    this.countryControl.setValue("");
    this.countryInput.nativeElement.value = "";
    this.omitChanges();
    // this
  }
  removeCountry(countryId: any) {
    if (countryId == "all") {
      this.selectedCountry = [];
    } else {
      const index = this.selectedCountry.findIndex(
        (item) => item.countryId == countryId
      );
      this.selectedCountry.splice(index, 1);
    }
    this.stateList = [];
    this.cityList = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.getStateList("");
    this.omitChanges();
  }

  getStateList(value = "") {
    if (this.selectedCountry.length > 0) {
      this.b2bService
        .getStateList(
          value,
          this.selectedCountry.map((itm) => itm.countryId)
        )
        .subscribe((res) => {
          this.stateList = res.stateDataList;
          // console.log(this.selectedStates,"Sleected states");
          this.getCityList("");
        });
    } else {
      this.selectedStates = [];
    }
  }

  selectStates(event) {
    const receivedState = event.option.value;
    const found = this.selectedStates.findIndex(
      (ele) => ele.stateId === receivedState.stateId
    );
    if (found === -1) {
      this.selectedStates.push(receivedState);
      this.stateInput.nativeElement.value = "";
      this.stateControl.setValue(null);
      this.getCityList("");
      this.omitChanges();
    }
  }

  removeState(inState: any) {
    this.selectedStates = this.selectedStates.filter(
      (state) => inState.stateId !== state.stateId
    );
    this.selectedCities = [];
    this.getCityList("");
    this.omitChanges();
  }

  clearState() {
    this.stateList = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.omitChanges();
  }

  getCityList(value) {
    if (this.selectedStates.length > 0) {
      var tStates = this.selectedStates.map((state) => state.stateId);
      var params = { stateId: tStates, searchPhrase: value };
      this.b2bService.searchCitiesForStates(params).subscribe((res) => {
        this.cityList = res.cityDataList;
      });
    } else {
      this.selectedCities = [];
    }
  }

  onCitySelect(city: any) {
    const found = this.selectedCities.findIndex(
      (ele) => ele.cityId === city.cityId
    );

    if (found !== -1) {
    } else {
      this.selectedCities.push(city);
      this.cityInput.nativeElement.value = "";
      this.cityControl.setValue(null);
      this.omitChanges();
    }
  }

  onCityDeselect(city: any) {
    this.selectedCities = this.selectedCities.filter(
      (ele) => ele.cityId !== city.cityId
    );
    this.omitChanges();
  }
  // Company Functions.......
  selectedCompany(event: any, type = "chip"): void {
    const value =
      type == "chip"
        ? (event.value || "").trim()
        : event.option.value.companyName.trim();
    const found = this.includedCompanyList.indexOf(value);
    if (value && found === -1) {
      this.includedCompanyList.push({ name: value });
      this.omitChanges();
      this.setLocalStorageValues("recentCompany", { companyName: value });
      // Clear the input value
      if (event.input) {
        event.input.value = "";
      }
    }
    this.companyList = [];
    this.includeCompanyInput.nativeElement.value = "";
  }

  removeCompany(content) {
    const index = this.includedCompanyList.findIndex(
      (itm) => itm.name === content.name
    );
    this.includedCompanyList.splice(index, 1);
    this.omitChanges();
    this.companyList = [];
  }

  selectedDomain(event: any, type = "chip"): void {
    const value =
      type == "chip" ? (event.value || "").trim() : event.option.value.trim();
    const found = this.includedDominList.findIndex(
      (item) => item.name == value
    );
    if (value && found === -1) {
      this.includedDominList.push({ name: value });
      this.omitChanges();
      this.setLocalStorageValues("recentDomain", { name: value });
      if (event.input) {
        event.input.value = "";
      }
    }
    this.domainList = [];
    this.includedomainInput.nativeElement.value = "";
  }
  removeDomain(content) {
    const index = this.includedDominList.findIndex(
      (itm) => itm.name === content.name
    );
    this.includedDominList.splice(index, 1);
    this.domainList = [];
    this.omitChanges();
  }

  // Industry Functions...........

  includeIndustry(event: any, type = "chip"): void {
    const value =
      type == "chip" ? (event.value || "").trim() : event.option.value.trim();
    const found = this.includedIndustryList.indexOf(value);
    if (value && found === -1) {
      this.includedIndustryList.push(value);
      this.omitChanges();
      this.setLocalStorageValues("recentIncludeIndustry", value);
      if (event.input) {
        event.input.value = "";
      }
    }
    this.includeIndustryInput.nativeElement.value = "";
    this.industryList = [];
  }

  excludeIndustry(event: any, type = "chip"): void {
    const value =
      type == "chip" ? (event.value || "").trim() : event.option.value.trim();
    const found = this.excludedIndustryList.indexOf(value);
    if (value && found === -1) {
      this.excludedIndustryList.push(value);
      this.omitChanges();
      this.setLocalStorageValues("recentExcludeIndustry", value);
      // Clear the input value
      if (event.input) {
        event.input.value = "";
      }
    }
    this.excludeIndustryInput.nativeElement.value = "";
    this.industryList = [];
  }

  removeIndustry(value) {
    const index = this.includedIndustryList.indexOf(value);
    this.includedIndustryList.splice(index, 1);
    this.includeIndustryInput.nativeElement.value = "";
    this.industryList = [];
    this.omitChanges();
  }

  removeExcludeIndustry(value) {
    const index = this.excludedIndustryList.indexOf(value);
    this.excludedIndustryList.splice(index, 1);
    this.omitChanges();
    this.excludeIndustryInput.nativeElement.value = "";
    this.industryList = [];
  }
  selectedTechnology(event: any, type = "chip"): void {
    const value =
      type == "chip" ? (event.value || "").trim() : event.option.value.trim();
    const found = this.includedTechnologyList.findIndex(
      (item) => item.name == value
    );
    if (value && found === -1) {
      this.includedTechnologyList.push({ name: value });
      this.omitChanges();
      this.setLocalStorageValues("recentTechnology", { name: value });
      if (event.input) {
        event.input.value = "";
      }
    }
    this.includeTechnologyInput.nativeElement.value = "";
    this.technologyList = [];
  }

  removeTechnology(content) {
    const index = this.includedTechnologyList.findIndex(
      (itm) => itm.name === content.name
    );
    this.includedTechnologyList.splice(index, 1);
    this.omitChanges();
  }

  selectPanel(type) {
    this.selectedPanel = type;
  }
  searchCompany(event: MatChipInputEvent) {}
  searchDomain(event: MatChipInputEvent) {}

  getAllFilterDatas() {
    this.companyListControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        this.b2bService.getCompanyList(value).subscribe(
          (res) => {
            this.companyList = res.companyList || [];
          },
          (err) => {
            console.log(err);
          }
        );
      } else if (value.length == 0) {
        this.companyList = [];
      }
    });
    this.domainListControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        this.b2bService.getDomainList(value).subscribe(
          (res) => {
            this.domainList = res.domainList || [];
          },
          (err) => {
            console.log(err);
          }
        );
      } else if (value.length == 0) {
        this.domainList = [];
      }
    });

    this.includeIndustryControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [
            ...this.includedIndustryList,
            ...this.excludedIndustryList,
          ],
        };
        this.b2bService.getIndustryList(body).subscribe((res) => {
          this.industryList = res.industryList;
        });
      } else {
        this.industryList = [];
      }
    });

    this.excludeIndustryControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [
            ...this.includedIndustryList,
            ...this.excludedIndustryList,
          ],
        };
        this.b2bService.getIndustryList(body).subscribe((res) => {
          this.industryList = res.industryList;
        });
      } else {
        this.industryList = [];
      }
    });

    this.technologyListControl.valueChanges.subscribe((value: string) => {
      if (value.length > 2) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [
            ...this.includedTechnologyList.map((item) => item.name),
          ],
        };
        this.b2bService.getTechnologyList(body).subscribe((res) => {
          this.technologyList = res.technologyList;
        });
      } else {
        this.technologyList = [];
      }
    });

    this.cityControl.valueChanges.subscribe((value: string) => {
      if (typeof value != "object") {
        this.getCityList(value);
      }
    });
    this.stateControl.valueChanges.subscribe((value: string) => {
      if (typeof value != "object") {
        this.getStateList(value);
      }
    });
    this.countryControl.valueChanges.subscribe((value: string) => {
      if (typeof value != "object") {
        this.getCountryList(value);
      }
    });
  }

  async setLocalStorageValues(type, value) {
    const data: Array<any> = (await this.filterStorageservice.get(type)) || [];
    let valueIndex = 0;
    if (typeof value == "object") {
      //At some cases we are adding the values as object.So we are taking the first key of the object
      const firstKey = Object.keys(value)[0];
      valueIndex = data.findIndex((itm) => itm[firstKey] == value[firstKey]);
    } else {
      valueIndex = data.indexOf(value);
    }
    if (valueIndex === -1) {
      await this.filterStorageservice.set(type, [...data.splice(-2), value]);
      this.getRecentValues();
    }
  }

  handleSearchSave() {
    this.cancelBtnClick(false);
    this.dataService.makeSavesearchVisible(true);
  }
  cancelBtnClick(value: boolean) {
    this.searchListDrawer = value;
  }

  invokeSearchList() {
    const isValid = this.validateSaveSearch();
    if (isValid == true) {
      this.searchListDrawer = true;
    }
  }

  validateSaveSearch() {
    return (
      this.includedDominList.length > 0 ||
      this.includedCompanyList.length > 0 ||
      this.includedIndustryList.length > 0 ||
      this.excludedIndustryList.length > 0 ||
      this.includedEmployeeRange.length > 0 ||
      this.includedRevenueRange.length > 0 ||
      this.selectedStates.length > 0 ||
      this.selectedCities.length > 0 ||
      this.selectedCountry.length > 0
    );
  }
  getPersistData() {
    // let that = this;
    setTimeout(() => {
      this.includedCompanyList =
        this.filterStorageservice.get("b2b_company_includedCompanyList") || [];
      this.includedDominList =
        this.filterStorageservice.get("b2b_company_includedDomainList") || [];
      this.includedIndustryList =
        this.filterStorageservice.get("b2b_company_includedIndustryList") || [];
      this.excludedIndustryList =
        this.filterStorageservice.get("b2b_company_excludedIndustryList") || [];
      this.includedTechnologyList =
        this.filterStorageservice.get("b2b_company_includedTechnologyList") ||
        [];
      this.includedEmployeeRange =
        this.filterStorageservice.get("b2b_company_includedEmployeeRange") ||
        [];
      this.includedRevenueRange =
        this.filterStorageservice.get("b2b_company_includedRevenueRange") || [];

      this.selectedStates =
        this.filterStorageservice.get("b2b_company_selectedStates") || [];
      this.selectedCities =
        this.filterStorageservice.get("b2b_company_selectedCities") || [];
      this.selectedCountry =
        this.filterStorageservice.get("b2b_company_selectedCountry") || [];
      // setTimeout(() => {
      this.omitChanges();
    });

    // }, 50);
  }

  getActiveFilterCount(obj: any) {
    const tempActiveFilters = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].length > 0) {
          tempActiveFilters.push(obj[key]);
        }
      }
    }
    this.activeFilterCount = tempActiveFilters.length;
  }

  clearAll() {
    this.includedDominList = [];
    this.includedCompanyList = [];
    this.includedIndustryList = [];
    this.excludedIndustryList = [];
    this.includedEmployeeRange = [];
    this.includedRevenueRange = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.selectedCountry = [];
    this.omitChanges();
    this.storeFilterData();
  }

  storeFilterData() {
    this.filterStorageservice.set(
      "b2b_company_includedCompanyList",
      this.includedCompanyList
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_includedDomainList",
      this.includedDominList
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_includedIndustryList",
      this.includedIndustryList
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_excludedIndustryList",
      this.excludedIndustryList
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_includedTechnologyList",
      this.includedTechnologyList
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_includedEmployeeRange",
      this.includedEmployeeRange
    ) || "";
    this.filterStorageservice.set(
      "b2b_company_includedRevenueRange",
      this.includedRevenueRange
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_selectedStates",
      this.selectedStates
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_selectedCities",
      this.selectedCities
    ) || [];
    this.filterStorageservice.set(
      "b2b_company_selectedCountry",
      this.selectedCountry
    );
  }
}
