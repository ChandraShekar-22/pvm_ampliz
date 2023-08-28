import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { COMMA, ENTER, L } from '@angular/cdk/keycodes';
import { UntypedFormControl } from '@angular/forms';
import { FilterStorageService } from '../../services/filter-storage.service';
import { AfterViewInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { B2bService } from '../../services/b2b.service';
import { SearchContactInput } from '../../models/SearchContactModel';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { Item } from 'angular2-multiselect-dropdown';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-filter-people',
  templateUrl: './filter-people.component.html',
  styleUrls: ['./filter-people.component.css'],
  // animations: [
  //   trigger("enterAnimation", [
  //     transition(":enter", [
  //       style({ transform: "translateX(70%)", opacity: 0 }),
  //       animate("200ms", style({ transform: "translateX(0)", opacity: 1 })),
  //     ]),
  //     transition(":leave", [
  //       style({ transform: "translateX(0)", opacity: 1 }),
  //       animate("200ms", style({ transform: "translateX(70%)", opacity: 0 })),
  //     ]),
  //   ]),
  // ],
})
export class FilterPeopleComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  constructor(
    private b2bService: B2bService,
    private filterStorageService: FilterStorageService,
    private dataService: DataService,
    private renderer: Renderer2,
    private messageService: MessageService
  ) {}
  @Output() onFilterChange = new EventEmitter<any>();
  @Output() filterApplied = new EventEmitter<any>();
  @Input() isSubscribed: boolean;
  searchContactInput: SearchContactInput = new SearchContactInput();
  selectable = true;
  removable = true;
  selectedPanel = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  activeFilterCount: number = 0;

  // Company Variables
  companyListControl = new UntypedFormControl();
  companyList: Array<any> = [];
  includedCompanyList: Array<any> = [];
  recentCompany: Array<any> = [];
  @ViewChild('includeCompanyInput')
  includeCompanyInput: ElementRef<HTMLInputElement>;

  // Company Keywords Variables
  companyKeywordsList: Array<any> = [];
  selectedCompanyKeywords: Array<any> = [];
  companyKeywordControl: UntypedFormControl = new UntypedFormControl();
  @ViewChild('comapanyKeywordInput')
  comapanyKeywordInput: ElementRef<HTMLInputElement>;
  recentCompanyKeyword: Array<any> = [];

  // Contact Name Variables
  contactListControl = new UntypedFormControl();
  recentContactsList: Array<any> = [];
  includedContactsList: Array<any> = [];
  @ViewChild('includeContactInput')
  includeContactInput: ElementRef<HTMLInputElement>;

  // Title  Variables
  includeTitleControl = new UntypedFormControl();
  excludeTitleControl = new UntypedFormControl();
  titleList: Array<any> = [];
  similarTitleList: Array<any> = [];
  includedTitleList: Array<any> = [];
  excludedTitleList: Array<any> = [];
  recentIncludeTitle: Array<any> = [];
  recentExcludeTitle: Array<any> = [];

  @ViewChild('includeTitleInput')
  includeTitleInput: ElementRef<HTMLInputElement>;
  @ViewChild('excludeTitleInput')
  excludeTitleInput: ElementRef<HTMLInputElement>;

  // Industry  Variables
  includeIndustryControl = new UntypedFormControl();
  excludeIndustryControl = new UntypedFormControl();
  industryList: Array<any> = [];
  selectedIndustryList: Array<any> = [];
  includedIndustryList: Array<any> = [];
  excludedIndustryList: Array<any> = [];
  recentIncludeIndustry: Array<any> = [];
  recentExcludeIndustry: Array<any> = [];
  @ViewChild('includeIndustryInput')
  includeIndustryInput: ElementRef<HTMLInputElement>;
  @ViewChild('excludeIndustryInput')
  excludeIndustryInput: ElementRef<HTMLInputElement>;

  // Seniority Variables
  seniorityListControl = new UntypedFormControl();
  seniorityList = this.dataService.seniorityList;
  includedSeniorityList: Array<any> = [];
  recentSeniority: Array<any> = [];
  @ViewChild('includeSeniorityInput')
  includeSeniorityInput: ElementRef<HTMLInputElement>;

  // Department Variables
  departmentListControl = new UntypedFormControl();
  departmentList: Array<any> = [];
  includedDepartmentList: Array<any> = [];
  recentDepartment: Array<any> = [];
  @ViewChild('includeDepartmentInput')
  includeDepartmentInput: ElementRef<HTMLInputElement>;

  // Skill Variables
  skillListControl = new UntypedFormControl();
  excludeSkillListControl = new UntypedFormControl();
  skillList: Array<any> = [];
  includedSkillList: Array<any> = [];
  excludedSkillList: Array<any> = [];
  recentIncludeSkill: Array<any> = [];
  recentExcludeSkill: Array<any> = [];
  @ViewChild('includeSkillInput')
  includeSkillInput: ElementRef<HTMLInputElement>;
  @ViewChild('excludeSkillInput')
  excludeSkillInput: ElementRef<HTMLInputElement>;

  // Employee Variables
  employeeList: Array<any> = [];
  includedEmployeeRange: Array<any> = [];

  // Revenue Variables
  revenueList: Array<any> = [];
  includedRevenueRange: Array<any> = [];

  //Country Variables
  countryList: Array<any> = [];
  countryControl: UntypedFormControl = new UntypedFormControl();
  selectedCountry: Array<any> = [];
  @ViewChild('countryInput')
  countryInput: ElementRef<HTMLInputElement>;

  //State Variables
  stateList: Array<any> = [];
  stateControl: UntypedFormControl = new UntypedFormControl();
  selectedStates: Array<any> = [];
  @ViewChild('stateInput')
  stateInput: ElementRef<HTMLInputElement>;

  //City Variables

  //Search List variables
  searchListDrawer: boolean = false;
  cityControl: UntypedFormControl = new UntypedFormControl();
  selectedCities: Array<any> = [];

  @ViewChild('cityInput')
  cityInput: ElementRef<HTMLInputElement>;
  cityList: any = [];

  subscription: Subscription;

  searchQuota: number = 1;
  totalQuota: any;

  ngOnInit() {
    this.getSearchQuota();
    setTimeout(() => {
      this.handleRecent();
    }, 300);
    this.handleForms();
    this.getEmployeeList();
    this.getRevenueList();
    this.getCountryList();
    this.getRecentValues();
    // this.getSeniorityList();
    this.getDepartmentList();
    this.getIndustryList();

    // this.dataService.searchOrRecentTapped(false);
  }

  getSearchQuota() {
    this.dataService.searchQuota.subscribe((quota: any) => {
      this.searchQuota = quota.dailyRemainingQuota;
      this.totalQuota = quota;
    });
  }
  handleRecent() {
    this.subscription = this.dataService.contactSearch.subscribe((res) => {
      if (res.fromSearch) {
        this.makeSearchDatas(res.data);
      } else {
        this.getPersistData();
      }
    });
  }

  getDepartmentList() {
    const body = {
      searchPhrase: this.departmentListControl.value || '',
      previouslySearchedTerm: [...this.includedDepartmentList],
    };
    this.b2bService.getDepartmentList(body).subscribe((res) => {
      this.departmentList = res.departmentList;
    });
  }
  getIndustryList() {
    const body = {
      searchPhrase: this.includeIndustryControl.value || '',
      previouslySearchedTerm: [...this.includedIndustryList, ...this.excludedIndustryList],
    };
    this.b2bService.getIndustryList(body).subscribe((res) => {
      this.industryList = res.industryList;
    });
  }
  // getSeniorityList() {
  //   this.b2bService.getSeniorityList('').subscribe((res) => {
  //     this.seniorityList = res.seniorityList;
  //   });
  // }

  ngOnChanges() {}
  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    this.dataService.passSearchContactInput(this.searchContactInput, false);
  }

  omitChanges() {
    this.searchContactInput.companyList = this.includedCompanyList;
    this.searchContactInput.fullNameList = this.includedContactsList;
    this.searchContactInput.titleInclude = this.includedTitleList;
    this.searchContactInput.titleExclude = this.excludedTitleList;
    this.searchContactInput.industryInclude = this.includedIndustryList;
    this.searchContactInput.industryExclude = this.excludedIndustryList;
    this.searchContactInput.seniority = this.includedSeniorityList;
    // this.searchContactInput.seniority = this.includedSeniorityList.map(
    //   (seniority) => {
    //     return seniority.Value;
    //   }
    // );

    this.searchContactInput.deptInclude = this.includedDepartmentList;
    this.searchContactInput.skillInclude = this.includedSkillList;
    this.searchContactInput.skillExclude = this.excludedSkillList;
    this.searchContactInput.employeeRangeList = this.includedEmployeeRange;
    this.searchContactInput.revenue = this.includedRevenueRange;

    // this.searchContactInput.specialtyIds = this.selectedCompanyKeywords.map(
    //   (keyword) => {
    //     return keyword.label;
    //   }
    // );
    this.searchContactInput.specialtyIds = this.selectedCompanyKeywords;
    // console.log(
    //   this.searchContactInput.revenue,
    //   "this.searchContactInput.revenue"
    // );

    this.searchContactInput.stateList = this.selectedStates.map((state) =>
      state.stateFullName ? state.stateFullName.toLowerCase() : state.toLowerCase()
    );
    this.searchContactInput.cityList = this.selectedCities.map((city) =>
      city.city ? city.city.toLowerCase() : city.toLowerCase()
    );
    this.searchContactInput.countryList = this.selectedCountry.map((itm) =>
      itm.country ? itm.country.toLowerCase() : itm.toLowerCase()
    );
    // ? [this.selectedCountry.countryId]
    // : [];

    this.getActiveFilterCount(this.searchContactInput);
    if (this.activeFilterCount > 0) {
      // this.b2bService.decreaseQuotaByOne().subscribe((res) => {});
      this.onFilterChange.emit(this.searchContactInput);
      this.filterApplied.emit(true);
    } else {
      this.filterApplied.emit(false);
    }
    this.storeFilterData();
  }
  getPersistData() {
    // let that = this;
    setTimeout(() => {
      this.includedCompanyList = this.filterStorageService.get('b2b_people_includedCompanyList') || [];
      this.includedContactsList = this.filterStorageService.get('b2b_people_includedContactsList') || [];
      this.includedTitleList = this.filterStorageService.get('b2b_people_includedTitleList') || [];
      this.excludedTitleList = this.filterStorageService.get('b2b_people_excludedTitleList') || [];
      this.includedIndustryList = this.filterStorageService.get('b2b_people_includedIndustryList') || [];
      this.excludedIndustryList = this.filterStorageService.get('b2b_people_excludedIndustryList') || [];
      this.includedSeniorityList = this.filterStorageService.get('b2b_people_includedSeniorityList') || [];
      this.includedDepartmentList = this.filterStorageService.get('b2b_people_includedDepartmentList') || [];
      this.includedSkillList = this.filterStorageService.get('b2b_people_includedSkillList') || [];
      this.excludedSkillList = this.filterStorageService.get('b2b_people_excludedSkillList') || [];
      this.includedEmployeeRange = this.filterStorageService.get('b2b_people_includedEmployeeRange') || [];
      this.includedRevenueRange = this.filterStorageService.get('b2b_people_includedRevenueRange') || [];
      // console.log(this.includedRevenueRange, "this.includedRevenueRange");
      this.selectedStates = this.filterStorageService.get('b2b_people_selectedStates') || [];
      this.selectedCities = this.filterStorageService.get('b2b_people_selectedCities') || [];
      this.selectedCountry = this.filterStorageService.get('b2b_people_selectedCountry') || [];
      this.selectedCompanyKeywords = this.filterStorageService.get('b2b_people_selectedCompanyKeywords') || [];
      // setTimeout(() => {
      this.omitChanges();
    });

    // }, 50);
  }
  makeSearchDatas(searchData: SearchContactInput) {
    if (this.searchQuota > 0) {
      if (searchData.companyList.length > 0) {
        this.includedCompanyList = searchData.companyList;
        this.setLocalStorageValues('recentCompany', searchData.companyList[0]); // For showing result in rcent used company option
      }

      this.includedContactsList = searchData.fullNameList;
      // searchData.fullName !== "" ? searchData.fullName.split(",") : [];
      this.includedTitleList = searchData.titleInclude;
      this.excludedTitleList = searchData.titleExclude;
      this.includedIndustryList = searchData.industryInclude;
      this.excludedIndustryList = searchData.industryExclude;
      this.includedDepartmentList = searchData.deptInclude;
      this.includedSkillList = searchData.skillInclude;
      this.excludedSkillList = searchData.skillExclude;
      this.includedEmployeeRange = searchData.employeeRangeList;
      searchData.revenue = [...searchData.revenue];
      this.includedRevenueRange = searchData.revenue;
      this.selectedCompanyKeywords = searchData.specialtyIds;
      // console.log(this.includedRevenueRange, "inside make search");
      this.selectedStates = searchData.stateList;
      this.selectedCities = searchData.cityList;
      this.selectedCountry = searchData.countryList.length > 0 ? searchData.countryList : [];
      this.includedSeniorityList = searchData.seniority;

      // const seniorityObj = this.getSeniorityObject(searchData.seniority);
      // this.includedSeniorityList = seniorityObj;
      this.omitChanges();
    } else {
      this.messageService.displayError(true, "You don't have enough search quota");
    }
  }

  handleSearchSave() {
    this.cancelBtnClick(false);
    this.dataService.makeSavesearchVisible(true);
  }

  getEmployeeList() {
    this.b2bService.getEmployeeList().subscribe((res) => {
      this.employeeList = res.employeeList;
    });
  }

  getRevenueList() {
    this.revenueList = [
      '$1M - $10M',
      '$10M - $50M',
      '$50M - $100M',
      '$100M - $250M',
      '$250M - $500M',
      '$500M - $1B',
      '$1B - $5B',
      '$5B - $10B',
      '$10B + $1B - $5B < $1M',
    ];
    // this.b2bService.getRevenueList().subscribe((res) => {
    //   this.revenueList = res.revenueList;

    // });
  }

  getCompanyKeywordsList(value = '') {
    this.b2bService.getCompanyKeywordList(value).subscribe((res) => {
      this.companyKeywordsList = res.companyKeywordsList;
    });
  }

  removeCompanyKeyword(keyword: any) {
    if (keyword == 'all') {
      this.selectedCompanyKeywords = [];
    }
    const index = this.selectedCompanyKeywords.findIndex((item) => item.keywords == keyword);
    this.selectedCompanyKeywords.splice(index, 1);
    this.companyKeywordsList = [];
    this.omitChanges();
  }

  getCountryList(value = '') {
    this.b2bService.getCountryList(value).subscribe((res) => {
      this.countryList = res.countryList;
      this.getStateList();
    });
  }

  countrySelected(event) {
    const index = this.selectedCountry.findIndex((item) => item.country == event.option.value.country);
    if (index == -1) {
      this.selectedCountry.push(event.option.value);
    }
    this.countryControl.setValue('');
    this.countryInput.nativeElement.value = '';
    this.getStateList();
    this.omitChanges();
    // this
  }
  removeCountry(country: any) {
    if (country == 'all') {
      this.selectedCountry = [];
    } else {
      const index = this.selectedCountry.findIndex((item) => item.country == country);
      this.selectedCountry.splice(index, 1);
    }
    // this.selectedCities = [];
    // this.selectedStates = [];
    this.stateList = [];
    this.cityList = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.getStateList();
    this.omitChanges();
  }

  getStateList(value = '') {
    // console.log(this.selectedCountry)
    if (this.selectedCountry.length > 0) {
      this.b2bService
        .getStateList(
          value,
          this.selectedCountry.map((itm) => itm.countryId)
        )
        .subscribe((res) => {
          this.stateList = res.stateDataList;
          // console.log(this.selectedStates, "Sleected states");
          this.getCityList();
        });
    } else {
      this.selectedStates = [];
    }
  }

  selectStates(event) {
    const receivedState = event.option.value;
    const found = this.selectedStates.findIndex((ele) => ele.stateFullName === receivedState.stateFullName);
    if (found === -1) {
      this.selectedStates.push(receivedState);
      this.stateInput.nativeElement.value = '';
      this.stateControl.setValue(null);
      this.getCityList('');
      this.omitChanges();
      // this.storeFilterData();
      // setTimeout(() => {
      //   this.addCitiesInList(receivedState);
      // }, 200);
    }
  }

  removeEmployeeRange(index: number) {
    // console.log(index);
    this.includedEmployeeRange = this.includedEmployeeRange.filter((item, i) => {
      return i != index;
    });
    this.omitChanges();
  }

  removeState(inState: any) {
    this.selectedStates = this.selectedStates.filter((state) => inState.stateFullName !== state.stateFullName);
    this.selectedCities = [];
    this.getCityList();
    // this.filteredCities = this.filteredCities.filter(
    //   (city) => city.stateId !== inState.stateId
    // );
    // this.searchCity = this.filteredCities;

    this.omitChanges();
  }
  clearState() {
    this.stateList = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.omitChanges();
  }

  getCityList(value = '') {
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
    const found = this.selectedCities.findIndex((ele) => ele.city === city.city);

    if (found !== -1) {
    } else {
      this.selectedCities.push(city);
      this.cityInput.nativeElement.value = '';
    }
    this.omitChanges();
  }

  onCityDeselect(city: any) {
    this.selectedCities = this.selectedCities.filter((ele) => ele.city !== city.city);
    this.omitChanges();
  }

  getRecentValues() {
    this.recentCompany = this.filterStorageService.get('recentCompany') || [];
    this.recentIncludeTitle = this.filterStorageService.get('recentIncludeTitleList') || [];
    this.recentExcludeTitle = this.filterStorageService.get('recentExcludeTitleList') || [];
    this.recentIncludeIndustry = this.filterStorageService.get('recentIncludeIndustry') || [];
    this.recentExcludeIndustry = this.filterStorageService.get('recentExcludeIndustry') || [];
    this.recentSeniority = this.filterStorageService.get('recentSeniority') || [];
    this.recentDepartment = this.filterStorageService.get('recentDepartment') || [];
    this.recentIncludeSkill = this.filterStorageService.get('recentIncludeSkill') || [];
    this.recentExcludeSkill = this.filterStorageService.get('recentExcludeSkill') || [];
    this.recentCompanyKeyword = this.filterStorageService.get('recentCompanyKeyword') || [];
    this.recentCompanyKeyword = this.filterStorageService.get('recentCompanyKeyword') || [];
  }
  // ? (event.value || "").trim()
  // Company Functions.......
  selectedCompany(event: any, type = 'chip'): void {
    // console.log("IN SELEC COMPANY");
    // console.log("VALUE", event);
    // const val =
    //   type == "" ? event.option.value.companyName : event.option.value.trim();
    // console.log("VAL", val);
    // // console.log("type of  VALUE", (event.option.value || "").trim());
    // const value =
    //   type == "chip"
    //     ? (event.option.value || "").trim()
    //     : event.option.value.companyName.trim();
    // const value =
    // if (typeof event.option.value == "string") {
    //   return
    // }
    let value = '';
    if (typeof event.option.value == 'object') {
      value = event.option.value.companyName.trim();
    } else {
      value = event.option.value.trim();
    }
    const found = this.includedCompanyList.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.includedCompanyList.push(value);
      this.setLocalStorageValues('recentCompany', { companyName: value });
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.companyList = [];
    this.omitChanges();
    this.includeCompanyInput.nativeElement.value = '';
  }

  removeCompany(content: any) {
    if (content == 'clear') {
      this.includedCompanyList = [];
    } else {
      const index = this.includedCompanyList.findIndex((itm) => itm.name === content.name);
      this.includedCompanyList.splice(index, 1);
    }
    this.omitChanges();
    this.companyList = [];
  }

  // Contact Functions...........

  selectedContact(event: any, type = 'chip'): void {
    const value = type == 'chip' ? (event.value || '').trim() : event.option.value.trim();
    const found = this.includedContactsList.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      // remove the below one line for multiple name
      // this.includedContactsList = [];
      this.includedContactsList.push(value);
      this.setLocalStorageValues('recentContactsList', value);
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.omitChanges();
    this.includeContactInput.nativeElement.value = '';
    this.recentContactsList = [];
  }

  removeContact(value: any) {
    const index = this.includedContactsList.indexOf(value);
    this.includedContactsList.splice(index, 1);
    this.includeContactInput.nativeElement.value = '';
    this.omitChanges();
    this.recentContactsList = [];
  }

  clearItems(event, key, type: any = 'array') {
    event.stopPropagation();
    if (type == 'array') {
      this[key] = [];
    } else {
      this[key] = '';
    }
    this.omitChanges();
  }

  // Title Functions...........

  includeTitle(event: any, type = 'chip'): void {
    const value = type == 'chip' ? (event.value || '').trim() : event.option.value.trim();
    const found = this.includedTitleList.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.includedTitleList.push(value);
      this.setLocalStorageValues('recentIncludeTitleList', value);
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.includeTitleControl.setValue(null);
    this.includeTitleInput.nativeElement.value = '';
    this.omitChanges();
    this.titleList = [];
  }

  excludeTitle(event: any, type = 'chip'): void {
    const value = type == 'chip' ? (event.value || '').trim() : event.option.value.trim();
    const found = this.excludedTitleList.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.excludedTitleList.push(value);
      this.omitChanges();
      this.setLocalStorageValues('recentExcludeTitleList', value);
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.excludeTitleControl.setValue(null);
    this.excludeTitleInput.nativeElement.value = '';
    this.titleList = [];
  }

  removeTitle(value) {
    const index = this.includedTitleList.indexOf(value);
    this.includedTitleList.splice(index, 1);
    this.omitChanges();
    this.titleList = [];
  }

  removeExcludeTitle(value) {
    const index = this.excludedTitleList.indexOf(value);
    this.excludedTitleList.splice(index, 1);
    this.omitChanges();
    this.titleList = [];
  }

  // Industry Functions...........

  // includeIndustry(event: any, type = "chip"): void {
  //   const value =
  //     type == "chip" ? (event.value || "").trim() : event.option.value.trim();
  //   const found = this.includedIndustryList.indexOf(value);
  //   // Add our fruit
  //   if (value && found === -1) {
  //     this.includedIndustryList.push(value);
  //     this.setLocalStorageValues("recentIncludeIndustry", value);
  //     // Clear the input value
  //     if (event.input) {
  //       event.input.value = "";
  //     }
  //   }
  //   this.includeIndustryInput.nativeElement.value = "";
  //   this.industryList = [];
  //   this.omitChanges();
  // }

  checkIncludeIndustry(event: any, value): void {
    event.stopPropagation();
    const found = this.includedIndustryList.indexOf(value);
    if (value && found === -1) {
      this.includedIndustryList.push(value);
      this.setLocalStorageValues('recentIncludeIndustry', value);
    }
    if (event.input) {
      event.input.value = '';
    }
    this.industryList = this.industryList.filter((item) => item !== value);
    this.omitChanges();
  }

  checkExcludeIndustry(event: any, value): void {
    event.stopPropagation();
    const found = this.excludedIndustryList.indexOf(value);
    if (value && found === -1) {
      this.excludedIndustryList.push(value);
      this.omitChanges();
      this.setLocalStorageValues('recentExcludeIndustry', value);
    }
    this.industryList = this.industryList.filter((item) => item !== value);
    this.omitChanges();
  }

  // excludeIndustry(event: any, type = "chip"): void {
  //   const value =
  //     type == "chip" ? (event.value || "").trim() : event.option.value.trim();
  //   const found = this.excludedIndustryList.indexOf(value);
  //   // Add our fruit
  //   if (value && found === -1) {
  //     this.excludedIndustryList.push(value);
  //     this.omitChanges();
  //     this.setLocalStorageValues("recentExcludeIndustry", value);
  //     // Clear the input value
  //     if (event.input) {
  //       event.input.value = "";
  //     }
  //   }
  //   this.excludeIndustryInput.nativeElement.value = "";
  //   this.industryList = [];
  //   this.omitChanges();
  // }

  removeIndustry(value) {
    const index = this.includedIndustryList.indexOf(value);
    this.includedIndustryList.splice(index, 1);
    this.includeIndustryInput.nativeElement.value = '';
    this.omitChanges();
    this.getIndustryList();
  }

  removeExcludeIndustry(value) {
    const index = this.excludedIndustryList.indexOf(value);
    this.excludedIndustryList.splice(index, 1);
    this.excludeIndustryInput.nativeElement.value = '';
    this.omitChanges();
    this.getIndustryList();
  }

  // Seniority Functions.......
  selectedSeniority(event: any, type = 'chip'): void {
    // console.log("EVENT", event);
    const value = type == 'chip' ? (event.value || '').trim() : event.option.value.trim();
    const found = this.includedSeniorityList.indexOf(value);
    if (value && found === -1) {
      // console.log("VALUE", value);
      this.includedSeniorityList.push(event);
      this.setLocalStorageValues('recentSeniority', value);
      if (event.input) {
        event.input.value = '';
      }
    }
    this.seniorityList = [];
    this.omitChanges();
    this.includeSeniorityInput.nativeElement.value = '';
    this.seniorityList = [];
  }

  removeSeniority(content) {
    this.includedSeniorityList = this.includedSeniorityList.filter((item) => {
      return item !== content;
    });
    this.omitChanges();
  }

  // Department Functions.......
  //  selectedDepartment(event: any, type = "chip"): void {
  //   console.log(event);
  //   const value =
  //     type == "chip" ? (event.value || "").trim() : event.option.value.trim();
  //   const found = this.includedDepartmentList.indexOf(value);
  //   if (value && found === -1) {
  //     this.includedDepartmentList.push(value);
  //     this.setLocalStorageValues("recentDepartment", value);
  //     if (event.input) {
  //       event.input.value = "";
  //     }
  //   }
  //   // this.departmentList = [];
  //   this.omitChanges();
  //   this.includeDepartmentInput.nativeElement.value = "";
  // }

  checkDepartmentOption(event, value) {
    event.stopPropagation();
    const found = this.includedDepartmentList.indexOf(value);
    if (value && found === -1) {
      this.includedDepartmentList.push(value);
      this.setLocalStorageValues('recentDepartment', value);
    }
    this.departmentList = this.departmentList.filter((item) => item !== value);
    this.omitChanges();
    // this.includeDepartmentInput.nativeElement.value = "";
  }

  removeDepartment(content) {
    const index = this.includedDepartmentList.indexOf(content);
    this.includedDepartmentList.splice(index, 1);
    this.getDepartmentList();
    this.omitChanges();
  }

  // Company Keyword Functions.......
  companyKeywordSelected(event: any, type = 'chip'): void {
    // console.log("Value", event.option.value);
    const value = event.value;
    // const value = event.option.value;
    const found = this.selectedCompanyKeywords.indexOf(value);
    if (value && found === -1) {
      this.selectedCompanyKeywords.push(value);
      // console.log("SELECTED LIST", this.selectedCompanyKeywords);
      this.setLocalStorageValues('recentCompanyKeyword', value);
      this.companyKeywordsList = [];
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.comapanyKeywordInput.nativeElement.value = '';
    this.omitChanges();
    this.companyKeywordsList = [];
  }

  // Skill Functions.......
  includeSkill(event: any, type = 'chip'): void {
    const value = type == 'chip' ? (event.value || '').trim() : event.option.value.trim();
    const found = this.includedSkillList.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.includedSkillList.push(value);
      this.setLocalStorageValues('recentIncludeSkill', value);
      this.skillList = [];
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.includeSkillInput.nativeElement.value = '';
    this.omitChanges();
    this.skillList = [];
  }

  excludeSkill(event: any, type = 'chip'): void {
    const value = type == 'chip' ? (event.value || '').trim() : event.option.value.trim();
    const found = this.excludedSkillList.indexOf(value);
    // Add our fruit
    if (value && found === -1) {
      this.excludedSkillList.push(value);
      this.setLocalStorageValues('recentExcludeSkill', value);
      this.omitChanges();
      this.skillList = [];
      // Clear the input value
      if (event.input) {
        event.input.value = '';
      }
    }
    this.excludeSkillInput.nativeElement.value = '';
    this.omitChanges();
    this.skillList = [];
  }

  async setLocalStorageValues(type, value) {
    const data: Array<any> = (await this.filterStorageService.get(type)) || [];
    let valueIndex = 0;
    if (typeof value == 'object') {
      //At some cases we are adding the values as object.So we are taking the first key of the object
      const firstKey = Object.keys(value)[0];
      valueIndex = data.findIndex((itm) => itm[firstKey] == value[firstKey]);
    } else {
      valueIndex = data.indexOf(value);
    }
    if (valueIndex === -1) {
      await this.filterStorageService.set(type, [...data.splice(-2), value]);
      this.getRecentValues();
    }
  }

  removeSkill(content) {
    const index = this.includedSkillList.findIndex((itm) => itm.name === content.name);
    this.includedSkillList.splice(index, 1);
    this.skillList = [];
    this.omitChanges();
  }

  removeExcludeSkill(content) {
    const index = this.excludedSkillList.findIndex((itm) => itm.name === content.name);
    this.excludedSkillList.splice(index, 1);
    this.skillList = [];
    this.omitChanges();
  }
  removeRevenue(value) {
    this.includedRevenueRange = this.includedRevenueRange.filter((item) => {
      return item !== value;
    });
    this.omitChanges();
  }

  handleForms() {
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

    this.contactListControl.valueChanges.subscribe((value: string) => {
      if (value.length == 1) {
        this.recentContactsList = this.filterStorageService.get('recentContactsList') || [];
      } else if (value.length == 0) {
        this.recentContactsList = [];
      }
    });
    this.includeTitleControl.valueChanges.subscribe((value: string = '') => {
      let hv = value !== null ? value : '';
      if (hv.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [...this.includedTitleList, ...this.excludedTitleList],
        };
        this.b2bService.getTitlesList(body).subscribe((res) => {
          this.titleList = res.titleList;
        });
      } else {
        this.titleList = [];
      }
    });
    this.excludeTitleControl.valueChanges.subscribe((value: string) => {
      let hv = value !== null ? value : '';
      if (hv.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [...this.includedTitleList, ...this.excludedTitleList],
        };
        this.b2bService.getTitlesList(body).subscribe((res) => {
          this.titleList = res.titleList;
        });
      } else {
        this.titleList = [];
      }
    });

    this.includeIndustryControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [...this.includedIndustryList, ...this.excludedIndustryList],
        };
        this.b2bService.getIndustryList(body).subscribe((res) => {
          this.industryList = res.industryList;
        });
      } else {
        this.getIndustryList();
      }
    });

    this.excludeIndustryControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [...this.includedIndustryList, ...this.excludedIndustryList],
        };
        this.b2bService.getIndustryList(body).subscribe((res) => {
          this.industryList = res.industryList;
        });
      } else {
        this.getIndustryList();
      }
    });

    // this.seniorityListControl.valueChanges.subscribe((value: string) => {
    //   let hv = value !== null ? value : "";
    //   if (hv.length > 0) {
    //     this.b2bService.getSeniorityList('').subscribe((res) => {
    //       this.seniorityList = res.seniorityList;
    //     });
    //   } else {
    //     this.seniorityList = [];
    //   }
    // });
    this.departmentListControl.valueChanges.subscribe((value: string) => {
      let hv = value !== null ? value : '';
      const body = {
        searchPhrase: hv,
        previouslySearchedTerm: [...this.includedDepartmentList],
      };
      if (hv.length >= 0) {
        this.b2bService.getDepartmentList(body).subscribe((res) => {
          this.departmentList = res.departmentList;
        });
      } else {
        this.departmentList = [];
      }
    });

    this.skillListControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [...this.includedSkillList, ...this.excludedSkillList],
        };
        this.b2bService.getSkillList(body).subscribe((res) => {
          this.skillList = res.skillList;
        });
      } else {
        this.skillList = [];
      }
    });

    // MatAutocomplete for company keywords
    // this.companyKeywordControl.valueChanges.subscribe((value: string) => {
    //   if (value.length > 1) {
    //     const tempPreviouslyCompany = this.selectedCompanyKeywords.map((el) => {
    //       return el.label;
    //     });
    //     // const tempPreviouslyCompany = this.selectedCompanyKeywords;
    //     const body = {
    //       searchPhrase: value,
    //       previouslySearchedTerm: tempPreviouslyCompany,
    //     };
    //     this.b2bService.getCompanyKeywordList(body).subscribe((res) => {
    //       this.companyKeywordsList = res.specialityIdList;
    //     });
    //   } else {
    //     this.companyKeywordsList = [];
    //   }
    // });

    this.excludeSkillListControl.valueChanges.subscribe((value: string) => {
      if (value.length > 1) {
        const body = {
          searchPhrase: value,
          previouslySearchedTerm: [...this.includedSkillList, ...this.excludedSkillList],
        };
        this.b2bService.getSkillList(body).subscribe((res) => {
          this.skillList = res.skillList;
        });
      } else {
        this.skillList = [];
      }
    });

    this.cityControl.valueChanges.subscribe((value: string) => {
      if (typeof value != 'object') {
        this.getCityList(value);
      }
    });

    this.stateControl.valueChanges.subscribe((value: string) => {
      if (typeof value != 'object') {
        this.getStateList(value);
      }
    });
    this.countryControl.valueChanges.subscribe((value: string) => {
      if (typeof value != 'object') {
        this.getCountryList(value);
      }
    });
  }
  invokeSearchList() {
    const isValid = this.validateSaveSearch();
    if (isValid == true) {
      this.searchListDrawer = true;
    }
  }
  cancelBtnClick(value: boolean) {
    this.searchListDrawer = value;
  }

  validateSaveSearch() {
    // console.log(this.includedCompanyList,this.includedContactsList,this.includedTitleList, this.excludedTitleList, this.includedIndustryList, this.excludedIndustryList,
    //   this.includedSeniorityList,
    //   this.includedDepartmentList,this.includedSkillList,this.excludedSkillList,this.includedEmployeeRange,this.includedRevenueRange,this.selectedStates,
    //   this.selectedCities,this.selectedCountry)
    return (
      this.includedCompanyList.length > 0 ||
      this.includedContactsList.length > 0 ||
      this.includedTitleList.length > 0 ||
      this.excludedTitleList.length > 0 ||
      this.includedIndustryList.length > 0 ||
      this.excludedIndustryList.length > 0 ||
      this.includedSeniorityList.length > 0 ||
      this.includedDepartmentList.length > 0 ||
      this.includedSkillList.length > 0 ||
      this.excludedSkillList.length > 0 ||
      this.includedEmployeeRange.length > 0 ||
      this.includedRevenueRange.length > 0 ||
      this.selectedStates.length > 0 ||
      this.selectedCities.length > 0 ||
      this.selectedCountry.length > 0 ||
      this.selectedCompanyKeywords.length > 0
    );
  }

  storeFilterData() {
    this.filterStorageService.set('b2b_people_includedCompanyList', this.includedCompanyList);
    this.filterStorageService.set('b2b_people_includedContactsList', this.includedContactsList);
    this.filterStorageService.set('b2b_people_includedTitleList', this.includedTitleList);
    this.filterStorageService.set('b2b_people_excludedTitleList', this.excludedTitleList);
    this.filterStorageService.set('b2b_people_includedIndustryList', this.includedIndustryList);
    this.filterStorageService.set('b2b_people_excludedIndustryList', this.excludedIndustryList);
    this.filterStorageService.set('b2b_people_includedSeniorityList', this.includedSeniorityList);
    this.filterStorageService.set('b2b_people_includedDepartmentList', this.includedDepartmentList);
    this.filterStorageService.set('b2b_people_includedSkillList', this.includedSkillList);
    this.filterStorageService.set('b2b_people_excludedSkillList', this.excludedSkillList);
    this.filterStorageService.set('b2b_people_includedEmployeeRange', this.includedEmployeeRange);
    this.filterStorageService.set('b2b_people_includedRevenueRange', this.includedRevenueRange);
    this.filterStorageService.set('b2b_people_selectedStates', this.selectedStates);
    this.filterStorageService.set('b2b_people_selectedCities', this.selectedCities);
    this.filterStorageService.set('b2b_people_selectedCountry', this.selectedCountry);
    this.filterStorageService.set('b2b_people_selectedCompanyKeywords', this.selectedCompanyKeywords);
  }
  compareObjects(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
  // returning senioirty object when ID is recived from save-search component
  // getSeniorityObject(id: any) {
  //   var result = [];
  //   id.map((x) => {
  //     var filter = this.seniorityList.filter((obj) => {
  //       return obj.Value === x;
  //     });
  //     result.push(filter[0]);
  //   });
  //   return result;
  // }

  getActiveFilterCount(obj: any) {
    const tempActiveFilters = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].length > 0) {
          tempActiveFilters.push(obj[key]);
        }
      }
    }
    this.activeFilterCount = tempActiveFilters.length - 1;
  }

  clearAll() {
    this.filterApplied.emit(false);
    this.includedCompanyList = [];
    this.includedContactsList = [];
    this.includedTitleList = [];
    this.excludedTitleList = [];
    this.includedIndustryList = [];
    this.excludedIndustryList = [];
    this.includedSeniorityList = [];
    this.includedDepartmentList = [];
    this.includedSkillList = [];
    this.excludedSkillList = [];
    this.includedEmployeeRange = [];
    this.includedRevenueRange = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.selectedCountry = [];
    this.selectedCompanyKeywords = [];
    this.omitChanges();
    this.storeFilterData();
  }
  // triggerAutoFocus(eleId: string) {
  //   console.log("input", eleId);
  //   const element = this.renderer.selectRootElement('#includeCompanyInput');
  //   setTimeout(() => element.focus(), 100);
  // }
}
