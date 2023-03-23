import {
  Component,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { SkeletonloaderService } from "src/app/modules/healthcare/services/skeletonloader.service";
import { PaginationService } from "../../services/pagination.service";
import "rxjs/Rx";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-tab",
  templateUrl: "./my-tab.component.html",
  styleUrls: ["./my-tab.component.css"],
})
export class MyTabComponent implements OnInit, AfterViewInit {
  subscriptions = [];
  currentCredit: any;
  headerData: any = "";
  subscribed: boolean;
  deptartment_data = [1, 2, 3, 4, 5];
  tab = 1;
  listId: any;

  physicianSearchParameter: any = {};
  offset: number = 0;
  limit: number = 5;
  leadWithEmail: boolean = false;
  leadWithPhone: boolean = false;
  leadWithProvider: boolean = false;
  searchType: string;
  searchResult: any;
  totalSearchResult: any;
  netNewCount: number;
  totalCount: number;
  totalSize: any;
  pager: any = {};
  pagedItems: any;
  filterChangeOmitted: boolean = false;
  page: any;
  noResult: boolean = false;
  subscriptionVal: boolean;
  unLockDiv: boolean = false;
  public user = null;
  showLoader: boolean = false;
  pyTotalCount: any;
  newNetVal: boolean = false;
  clientIp: any = "";
  constructor(
    public amplizService: AmplizService,
    private loaderService: SkeletonloaderService,
    private pagerservice: PaginationService,
    private router: Router
  ) {}

  get subscriptionType() {
    return localStorage.getItem("SubscriptionisActive");
  }

  get isPaid() {
    return this.subscribed;
    // return true;
  }

  ngOnInit() {
    // this.getPhysicianSearchData();
    // this.getIPAddress();
    this.getDashboardDetails();
    this.netNewCount = 0;
  }
  ngAfterViewInit() {
    if (!this.filterChangeOmitted) {
      this.setPage(1);
      // this.getNetNewCount();
    }
  }
  // getIPAddress() {
  //   this.amplizService.getIpAddress().subscribe(res => {
  //     console.log(res);
  //     this.clientIp = res.ip||'';
  //   },(err: any) => {
      
  //   });
  // }
  async getDashboardDetails() {
    setTimeout(() => {
      this.loaderService.status.subscribe((res) => {
        this.showLoader = res;
      });
    });

    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.currentCredit = res.CurrentCredits;
          this.subscriptions = res.Subscriptions;
          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;

            this.headerData = "Upgrade";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
          //
        }
      );
    } else {
      this.amplizService.logout();
    }
  }
  filterChanged(event: any) {
    this.offset = 0;
    this.filterChangeOmitted = true;
    this.physicianSearchParameter.cityList = event.cityList.map((city) => city.city);
    this.physicianSearchParameter.hospitalNameList = event.hospitalNameList;
    this.physicianSearchParameter.physicianName = event.physicianName;
    this.physicianSearchParameter.specialityExcluded = event.specialityExcluded;
    this.physicianSearchParameter.specialityIncluded = event.specialityIncluded;
    this.physicianSearchParameter.stateList = event.stateList.map((state) => state.state);
    this.physicianSearchParameter.npiNumber = event.npiNumber;

    this.leadWithEmail = event.leadWithEmail || false;
    this.physicianSearchParameter.provider_Type = event.provider_Type
      ? "Independent"
      : "";
    this.getPhysicianSearchData();
  }
  getPhysicianSearchData() {
    this.loaderService.display(true);
    this.setPhysicianSearchParams();
    this.amplizService
      .searchPhysicianForSpeciality(
        this.physicianSearchParameter,
      )
      .subscribe(
        (res) => {
          this.searchResult = res;
          this.totalSearchResult = res.physicianInfoList;
          // this.netNewCount = res.netNew;
          this.totalCount = res.totalResult;
          this.totalSize = this.tab == 1 ? res.totalResult : res.netNew;
          this.loaderService.display(false);
          if (this.totalSearchResult.length !== 0) {
            this.noResult = false;
            this.totalCount = res.totalResult;
            this.pyTotalCount = res.totalResult;
            this.totalSize = this.tab == 1 ? res.totalResult : res.netNew;
            //
            this.pager = this.pagerservice.getPager(
              this.totalSize,
              this.page,
              this.limit
            );
            this.pagedItems = this.totalSearchResult.slice(
              this.pager.startIndex,
              this.pager.endIndex + 1
            );

            // this.getNetNewCount();
          } else {
            this.noResult = true;
          }
          //
        },
        (error) => {
          this.loaderService.display(false);
        }
      );
  }

  ngTab(value: any) {
    this.tab = value;
    this.setPage(1);
  }

  getNetNewCount() {
    this.physicianSearchParameter.offset = this.offset;
    this.physicianSearchParameter.limit = this.limit;
    this.physicianSearchParameter.emailTypeIsp = this.leadWithEmail
      ? "Yes"
      : "";
    this.physicianSearchParameter.leadWithEmail = false;
    this.physicianSearchParameter.leadWithPhone = this.leadWithPhone;
    this.physicianSearchParameter.searchType = "NETNEW";

    this.amplizService
      .getPhysicianNetNewCount(this.physicianSearchParameter)
      .subscribe((res) => {
        this.netNewCount = res.netNew;
      });
  }

  setPage(page: any) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    // if (this.subscribed === true || page === 1) {
    this.page = page;
    this.loaderService.display(true);
    this.offset = this.limit * (page - 1);
    this.setPhysicianSearchParams();
    this.amplizService
      .searchPhysicianForSpeciality(
        this.physicianSearchParameter,
      )
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.unLockDiv = false;
          this.totalSearchResult = res.physicianInfoList;
          //
          if (this.totalSearchResult.length !== 0) {
            this.noResult = false;
            this.totalCount = res.totalResult;
            if (this.tab === 1) {
              this.totalSize = res.totalResult;
            }
            if (this.tab === 2) {
              this.totalSize = this.netNewCount;
            }

            this.pager = this.pagerservice.getPager(
              this.totalSize,
              page,
              this.limit
            );
            this.pagedItems = this.totalSearchResult.slice(
              this.pager.startIndex,
              this.pager.endIndex + 1
            );

            this.getNetNewCount();
          } else {
            this.noResult = true;
          }
        },
        (error) => {
          this.loaderService.display(false);
        }
      );
    // } else {
    //   this.loaderService.display(false);
    //   this.unLockDiv = true;
    //   this.pager.currentPage = 2;
    //   this.offset = this.limit * (this.pager.currentPage - 1);
    // }
  }

  setPhysicianSearchParams() {
    this.physicianSearchParameter.offset = this.offset;
    this.physicianSearchParameter.limit = this.limit;
    this.physicianSearchParameter.emailTypeIsp = this.leadWithEmail
      ? "Yes"
      : "";
    this.physicianSearchParameter.leadWithEmail = false;
    this.physicianSearchParameter.leadWithPhone = this.leadWithPhone;
    this.physicianSearchParameter.provider_Type = this.leadWithProvider
      ? "Independent"
      : "";
    this.physicianSearchParameter.searchType =
      this.tab === 1 ? "TOTAL" : "NETNEW";
    // this.physicianSearchParameter.clientIp = this.clientIp;
  }

  downloadCsvFile() {
    this.amplizService
      .getSpecialityUsersExportCsv(
        this.physicianSearchParameter
      )
      .subscribe((el) => {
        const a = document.createElement("a");
        const blob = new Blob([el.body], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "exportFile" + ".csv";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }
  refreshedData(ev: any) {
    //
    if (ev === true) {
      this.setPage(1);
      this.getNetNewCount();
    }
  }
}
