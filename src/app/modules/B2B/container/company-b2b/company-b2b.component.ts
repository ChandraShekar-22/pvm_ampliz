import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { SearchCompanyInput } from "../../models/SearchCompany";
import { B2bService } from "../../services/b2b.service";
import { DataService } from "../../services/data.service";
import { Subscription } from "rxjs";
import { SkeletonloaderService } from "src/app/modules/healthcare/services/skeletonloader.service";
// import { EventEmitter } from "stream";
@Component({
  selector: "app-company-b2b",
  templateUrl: "./company-b2b.component.html",
  styleUrls: ["./company-b2b.component.css"],
})
export class CompanyB2bComponent implements OnInit, OnChanges {
  @Input() isRecentVisible: boolean;
  @Input() isSaveVisible: boolean;

  @Output() employeesSearched = new EventEmitter();

  selectedFilter: SearchCompanyInput = new SearchCompanyInput();
  companyList: Array<object> = [];
  currentItemNumber: number = 0;
  totalItemCount: number = 0;
  currentTab: number = 0;
  tabItems = [{ name: `Total (0)`, icon: { name: "" } }];
  selectedCompanies: Array<any> = [];
  constructor(
    private b2bService: B2bService,
    private dataService: DataService,
    private loaderService: SkeletonloaderService
  ) {}
  noResult: boolean = false;
  searchQuotaUsed: number = 1;
  showLandingDashboard: boolean = false;
  landingPageSubscription: Subscription;
  pageNumberOptions: Array<any> = [5, 10, 25, 50];
  showActivityCards: boolean = false;
  lowCreditAlert: boolean = false;
  showActivityBack: boolean = false;
  loaderSubscription: Subscription;
  showLoader: boolean = false;
  isSubscribed: boolean = false;
  showUpgradeCard: boolean = false;

  ngOnInit() {
    this.isSubscribed = localStorage.getItem("SubscriptionisActive") == "true";
    // this.getCompanyList();
    // this.collectCreditAndQuotaStatus();
  }
  collectCreditAndQuotaStatus() {
    this.dataService.subscriptionStatus.subscribe((status: any) => {
      const remainingCredits = status.dailyCredit - status.usedCredit;
      // this.manageActivityView(remainingCredits);
      this.manageLowCreditView(remainingCredits);
    });

    this.dataService.searchQuota.subscribe((quota) => {
      this.searchQuotaUsed = quota;
      this.getLoaderValue();
    });
  }

  getLoaderValue() {
    setTimeout(() => {
      this.loaderSubscription = this.loaderService.status.subscribe((res) => {
        this.showLoader = res;
      });
    });
  }
  get showResult() {
    return (
      this.showLandingDashboard == false &&
      this.isRecentVisible == false &&
      this.isSaveVisible == false &&
      !this.noResult &&
      !this.showActivityCards
    );
  }

  manageLowCreditView(credit) {
    if (credit < 10) {
      if (credit <= 0) {
        this.showUpgradeCard = true;
        this.lowCreditAlert = true;
      } else {
        this.lowCreditAlert = true;
      }
    } else {
      this.lowCreditAlert = false;
    }
  }

  manageActivityView(credit) {
    if (credit < 10) {
      this.showActivityCards = true;
    } else {
      this.showActivityCards = false;
    }
  }

  handleRecordsChange() {
    this.selectedFilter.offset = 0;
    this.currentItemNumber = 0;
    this.getCompanyList();
  }
  getLandingPageVisibility() {
    this.landingPageSubscription =
      this.dataService.landingPageVisibility.subscribe((res) => {
        this.showLandingDashboard = res;
      });
  }
  ngOnChanges() {
    if (
      this.isRecentVisible == false &&
      this.isSaveVisible == false &&
      !this.noResult
    ) {
      this.dataService.changeLoadStatus(false);
    }
  }

  getSearchQuota() {
    this.b2bService.getSearchQuota().subscribe((res) => {
      this.dataService.passSearchQuota(res);
      // this.searchQuota = 10;
      // this.dataService.passSearchQuota(100);
    });
  }

  getCompanyList() {
    const companyBody: SearchCompanyInput = this.selectedFilter;

    // contactsBody.offset =
    //   this.previousOffsets[this.previousOffsets.length - 1] || 0;
    // contactsBody.savedListOffset =
    //   this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;
    this.loaderService.display(true);
    this.noResult = false;

    this.b2bService.searchCompany(this.selectedFilter).subscribe(
      (res) => {
        this.collectCreditAndQuotaStatus();
        this.loaderService.display(false);
        this.getSearchQuota();
        this.companyList = res.companyInfoList;
        if (this.companyList.length !== 0) {
          this.noResult = false;
        } else {
          this.noResult = true;
        }
        this.b2bService.searchCompanyNetNew(this.selectedFilter).subscribe(
          (netNewCount) => {
            this.totalItemCount = netNewCount.totalCount;
            this.tabItems[0].name = `Total (${this.numberWithCommas(
              this.totalItemCount
            )})`;
          },
          (err) => {
            this.loaderService.display(false);
          }
        );
      },
      (err) => {
        this.collectCreditAndQuotaStatus();
        this.getSearchQuota();
        this.noResult = true;
        this.loaderService.display(false);
      }
    );
  }

  get decrementEnabled() {
    return this.selectedFilter.offset > 0;
  }

  decrementPage() {
    // console.log(this.selectedFilter.offset);
    if (this.decrementEnabled) {
      this.selectedFilter.offset =
        this.selectedFilter.offset - this.selectedFilter.count;
      this.currentItemNumber = this.selectedFilter.offset;
      this.getCompanyList();
    }
  }

  get incrementEnabled() {
    // console.log(this.selectedFilter.offset + this.selectedFilter.count, this.totalItemCount, this.selectedFilter.offset , this.selectedFilter.count)
    return (
      this.selectedFilter.offset + this.selectedFilter.count <
      this.totalItemCount
    );
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  incrementPage() {
    if (this.incrementEnabled) {
      this.selectedFilter.offset =
        this.selectedFilter.offset + this.selectedFilter.count;
      this.currentItemNumber = this.selectedFilter.offset;
      this.getCompanyList();
    }
  }

  filterChanged(event: SearchCompanyInput) {
    this.selectedFilter = event;
    this.selectedFilter.offset = 0;
    const isValid = event.validateCompanySearch();
    this.getCompanyList();
    if (isValid) {
      this.dataService.makeRecentsearchVisible(false);
      this.dataService.makeSavesearchVisible(false);
    }
  }

  handleSelectAll(event) {
    // console.log(event);
    this.selectedCompanies = [];
    if (event == true) {
      this.companyList.map((item: any) => {
        this.selectedCompanies.push(item.companyId);
      });
    } else {
      this.selectedCompanies = [];
    }
  }
  handleCheckboxChange(event, company) {
    // console.log(event,company,"Event and contact");
    const index = this.selectedCompanies.findIndex(
      (item) => item == company.companyId
    );
    if (index == -1) {
      this.selectedCompanies.push(company.companyId);
    } else {
      this.selectedCompanies.splice(index, 1);
    }
  }
  ngOnDestroy() {
    if (this.landingPageSubscription) {
      this.landingPageSubscription.unsubscribe();
    }
  }
  openActivityComponents() {
    this.showActivityCards = true;
    this.showActivityBack = true;
  }
  searchEmployee() {
    this.employeesSearched.emit();
  }
}
