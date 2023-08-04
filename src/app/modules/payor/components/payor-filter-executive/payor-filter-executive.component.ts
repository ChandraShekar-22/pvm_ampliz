import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Subscriber, Subscription } from "rxjs";
import { FilterStorageService } from "src/app/modules/B2B/services/filter-storage.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { ImagingDataService } from "src/app/modules/ImagingCenter/services/imaging-data.service";
import { ImagingService } from "src/app/modules/ImagingCenter/services/imaging.service";
import { SearchPayorExecutive } from "../../models/search-payor-executive.model";
import { DataService } from "../../service/data.service";
import { PayorService } from "../../service/payor.service";

@Component({
  selector: "app-payor-filter-executive",
  templateUrl: "./payor-filter-executive.component.html",
  styleUrls: ["./payor-filter-executive.component.css"],
})
export class PayorFilterExecutiveComponent implements OnInit {
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() isSubscribed: boolean = false;
  @Input() isPaid: boolean = false;
  filterData: SearchPayorExecutive = new SearchPayorExecutive();
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
  mapingValue = {
    "Payors/health Insurance": 0,
    "Preferred Provider Organization": 1,
    "Point Of Service": 2,
    "Exclusive Provider Organization": 3,
    "Health Maintenance Organization": 4,
  };

  //Imaging equipments

  numberOfImagingEquipmentList: string[] = [];

  constructor(
    private b2bService: ImagingService,
    private filterStorageService: FilterStorageService,
    private dataService: DataService,
    private payourService: PayorService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private amplizService: AmplizService
  ) {}

  ngOnInit() {
    this.getPersistData();
    this.getSeniorityList();
    this.getDepartmentList();
    this.getRevenueList();
    this.makeImagingEqipmentList();
    this.subscription = this.dataService.payourSearchData.subscribe((res) => {
      if (res.fromSearch) {
        this.filterData = res.data;
        this.omitChanges();
      }
    });
  }

  makeImagingEqipmentList() {
    // this.numberOfImagingEquipmentList = [];
    // for(let i=0;i<25;i++) {
    //   this.numberOfImagingEquipmentList.push(i+1);
    // }
    this.numberOfImagingEquipmentList = [
      "Payors/health Insurance",
      "Preferred Provider Organization",
      "Point Of Service",
      "Exclusive Provider Organization",
      "Health Maintenance Organization",
    ];
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    this.dataService.passSearchPayourInput(this.filterData, false);
  }
  getSeniorityList() {
    this.b2bService.getSeniorityList("").subscribe((res) => {
      this.seniorityList = res.seniorityList;
    });
  }

  getDepartmentList() {
    // const body = {
    //   // searchPhase: '',
    //   // previouslySearchedTerm: [
    //   //   ...this.filterData.department
    //   // ],
    // };
    // this.b2bService.getDepartmentList(body).subscribe((res) => {
    //   this.departmentList = res.departmentList;
    // });
    this.departmentList = [
      "Business Development",
      "Customer Services/Customer",
      "Engineering",
      "Finance",
      "Human Resources",
      "IT",
      "Marketing",
      "Operations",
      "Others",
      "Purchasing/Procurement",
      "R&D",
      "Sales",
      "Top Level Management",
      "Training",
    ];
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
      this.payourService.getCompanyList(item).subscribe((res) => {
        this.companyList = res.companyListMCO;
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
      this.payourService.getTitlesList(body).subscribe((res) => {
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
        searchPhrase: item,
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

  getPersistData() {
    // let that = this;
    setTimeout(() => {
      this.filterData.company =
        this.filterStorageService.get("payour_includedCompanyList") || [];
      this.filterData.fullName =
        this.filterStorageService.get("payour_includedContactsList") || [];
      this.filterData.titleInclude =
        this.filterStorageService.get("payour_includedTitleList") || [];
      this.filterData.titleExclude =
        this.filterStorageService.get("payour_excludedTitleList") || [];
      this.filterData.industryInclude =
        this.filterStorageService.get("payour_includedIndustryList") || [];
      this.filterData.titleExclude =
        this.filterStorageService.get("payour_excludedIndustryList") || [];
      this.filterData.seniority =
        this.filterStorageService.get("payour_includedSeniorityList") || [];
      this.filterData.department =
        this.filterStorageService.get("payour_includedDepartmentList") || [];

      this.filterData.stateList =
        this.filterStorageService.get("payour_selectedStates") || [];
      this.filterData.cityList =
        this.filterStorageService.get("payour_selectedCities") || [];
      this.selectedCountry =
        this.filterStorageService.get("payour_selectedCountry") || [];
      this.filterData.industry =
        this.filterStorageService.get("payour_executive_industry") || [];
      // setTimeout(() => {
      this.omitChanges();
    });
  }

  storeFilterData() {
    this.filterStorageService.set(
      "payour_includedCompanyList",
      this.filterData.company
    );
    this.filterStorageService.set(
      "payour_includedContactsList",
      this.filterData.fullName
    );
    this.filterStorageService.set(
      "payour_includedTitleList",
      this.filterData.titleInclude
    );
    this.filterStorageService.set(
      "payour_excludedTitleList",
      this.filterData.titleExclude
    );
    this.filterStorageService.set(
      "payour_includedIndustryList",
      this.filterData.industryInclude
    );
    this.filterStorageService.set(
      "payour_excludedIndustryList",
      this.filterData.industryExclude
    );
    this.filterStorageService.set(
      "payour_includedSeniorityList",
      this.filterData.seniority
    );
    this.filterStorageService.set(
      "payour_includedDepartmentList",
      this.filterData.department
    );
    this.filterStorageService.set(
      "payour_selectedStates",
      this.filterData.stateList
    );
    this.filterStorageService.set(
      "payour_selectedCities",
      this.filterData.cityList
    );
    this.filterStorageService.set(
      "payour_selectedCountry",
      this.selectedCountry
    );
    this.filterStorageService.set(
      "payour_executive_industry",
      this.filterData.industry
    );
  }

  omitChanges() {
    this.onFilterChange.emit(this.filterData);
    this.storeFilterData();
  }

  clearFilter() {
    const isValid = this.filterData.validateImagingSearch();
    if (isValid) {
      this.filterData = new SearchPayorExecutive();
      this.omitChanges();
    }
  }
  ngOnChanges() {
    this.isPaid = !this.isSubscribed;
    // this.isPaid = false;
    //
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
