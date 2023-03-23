import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { FilterStorageService } from 'src/app/modules/B2B/services/filter-storage.service';
import { SearchLTCModel } from '../../../models/SearchLTCModel';
import { LTCDataService } from '../../../services/ltc-data.service';
import { LTCService } from '../../../services/ltc.service';

@Component({
  selector: 'app-filter-ltc',
  templateUrl: './filter-ltc.component.html',
  styleUrls: ['./filter-ltc.component.css']
})
export class FilterLtcComponent implements OnInit,OnDestroy {
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() isSubscribed: boolean = false;
  filterData: SearchLTCModel = new SearchLTCModel();
  //company Variables
  companyList: Array<any> = [];

  //title
  titleList: Array<any> = [];

  // industry

  ltcTypeList: Array<any> = [];


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

  constructor(
    private b2bService: LTCService,
    private filterStorageService: FilterStorageService,
    private dataService: LTCDataService
  ) { }

  ngOnInit() {
    this.getPersistData();
    this.getSeniorityList();
    this.getDepartmentList();
    this.getRevenueList();
    this.getLtcTypeList();
    this.subscription = this.dataService.ltcSearchData.subscribe((res) => {
      if (res.fromSearch) {
        this.filterData=res.data;
        this.omitChanges();
      }
    });
  }
  

  getLtcTypeList() {
    const body = {
      searchPhrase: '',
      // previouslySearchedTerm: [
      //   ...this.filterData.industryInclude,
      //   ...this.filterData.industryExclude,
      // ],
    };
    this.b2bService.getLTCTypeAutoSuggest(body).subscribe(res => {
      this.ltcTypeList = res.ltcTypeInfoList;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.dataService.passSearchLTCInput(this.filterData, false);
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
    this.b2bService.getRevenueList().subscribe((res) => {
      this.revenueList = res.revenueList;
    });
  }

  // Company functions

  companyValueChanges(item) {
    if (item && item.length > 1) {
      this.b2bService.getCompanyList(item).subscribe(res => {
        this.companyList = res.companyListLtc;
      });
    }
  }
  // TITLE FUNCTIONS......................

  titleValueChanges(item) {
    if (item && item.length > 1) {
      const body = {
        searchPhrase: item,
        previousSearchedTitle: [
          ...this.filterData.titleInclude,
          ...this.filterData.titleExclude,
        ],
      };
      this.b2bService.getTitlesList(body).subscribe(res => {
        this.titleList = res.titleAll;
      });
    } else {
      this.titleList=[];
    }
  }
  // INDUSTRY FUNCTIONS......................

  ltcTypeValueChanges(item) {
    if (item && item.length > 1) {
      const body = {
        searchPhrase: item,
        // previouslySearchedTerm: [
        //   ...this.filterData.industryInclude,
        //   ...this.filterData.industryExclude,
        // ],
      };
      this.b2bService.getLTCTypeAutoSuggest(body).subscribe(res => {
        this.ltcTypeList = res.ltcTypeInfoList;
      });
    } else {
      this.ltcTypeList=[];
    }
  }
  // SKILL FUNCTIONS......................

  

  hanldeLocationValueChange(locationBody: any) {
    this.filterData.cityList = locationBody.city.map(item => item.city);
    this.filterData.stateList = locationBody.state.map(item => item.state);
    this.omitChanges();
  }

  getPersistData() {
    // let that = this;
    setTimeout(() => {
      this.filterData.companyList = this.filterStorageService.get(
        "ltc_includedCompanyList"
      ) || [];
      this.filterData.fullNameList = this.filterStorageService.get(
        "ltc_includedContactsList"
      ) || [];
      this.filterData.titleInclude = this.filterStorageService.get(
        "ltc_includedTitleList"
      ) || [];
      this.filterData.titleExclude = this.filterStorageService.get(
        "ltc_excludedTitleList"
      ) || [];
      this.filterData.ltcTypeInclude = this.filterStorageService.get(
        "ltc_ltcTypeInclude"
      ) || [];
      this.filterData.seniority = this.filterStorageService.get(
        "ltc_includedSeniorityList"
      ) || [];
      this.filterData.department = this.filterStorageService.get(
        "ltc_includedDepartmentList"
      ) || [];

      this.filterData.stateList = this.filterStorageService.get(
        "ltc_selectedStates"
      ) || [];
      this.filterData.cityList = this.filterStorageService.get(
        "ltc_selectedCities"
      ) || [];
      this.selectedCountry = this.filterStorageService.get(
        "ltc_selectedCountry"
      ) || [];
      // setTimeout(() => {
      this.omitChanges();
    });
  }

  storeFilterData() {
    this.filterStorageService.set(
      "ltc_includedCompanyList",
      this.filterData.companyList
    );
    this.filterStorageService.set(
      "ltc_includedContactsList",
      this.filterData.fullNameList
    );
    this.filterStorageService.set(
      "ltc_includedTitleList",
      this.filterData.titleInclude
    );
    this.filterStorageService.set(
      "ltc_excludedTitleList",
      this.filterData.titleExclude
    );
    this.filterStorageService.set(
      "ltc_ltcTypeInclude",
      this.filterData.ltcTypeInclude
    );
    this.filterStorageService.set(
      "ltc_includedSeniorityList",
      this.filterData.seniority
    );
    this.filterStorageService.set(
      "ltc_includedDepartmentList",
      this.filterData.department
    );
    this.filterStorageService.set(
      "ltc_selectedStates",
      this.filterData.stateList
    );
    this.filterStorageService.set(
      "ltc_selectedCities",
      this.filterData.cityList
    );
    this.filterStorageService.set(
      "ltc_selectedCountry",
      this.selectedCountry
    );
  }

  omitChanges() {
    this.onFilterChange.emit(this.filterData);
    this.storeFilterData();
  }

  clearFilter() {
    this.filterData = new SearchLTCModel();
    this.omitChanges();
  }
}
