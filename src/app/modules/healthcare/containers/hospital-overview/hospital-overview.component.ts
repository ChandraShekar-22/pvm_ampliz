import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { PaginationService } from "src/app/modules/healthcare/services/pagination.service";

@Component({
  selector: "app-hospital-overview",
  templateUrl: "./hospital-overview.component.html",
  styleUrls: ["./hospital-overview.component.css"],
})
export class HospitalOverviewComponent implements OnInit, AfterViewInit {
  tab = 1;
  paramsData: any;
  overviewResult: any;
  hospitalOverviewResult: any;
  index: number;
  subscriptions = [];
  headerData: any = "";
  subscribed: boolean;
  dataResult: any;
  notCorrectDrawer: boolean = false;
  saveDrawer: boolean = false;
  vtabLabel = "Earnings";
  totalSearchResult = [];
  noResult: boolean = false;
  hospitalPhysicianParameter: any = {};
  offset: number = 0;
  count: number = 5;
  totalSize: any;
  pager: any = {};
  pagedItems: any;
  page: any;
  unLockDiv: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public amplizService: AmplizService,
    private loaderService: LoaderService,
    private pagerservice: PaginationService
  ) {}

  // get physicianData() {
  //   return this.hospitalOverviewResult.physicians;
  // }

  get physicianCount() {
    return this.hospitalOverviewResult.noOfPhysician;
  }

  // get executiveData() {
  //   return this.hospitalOverviewResult.healthExecutives;
  // }

  get executiveCount() {
    return this.hospitalOverviewResult.noOfExecutive;
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.paramsData = this.activatedRoute.snapshot.params["hospitalId"];
    this.getHospitalOverviewData();
    this.getDashboardDetails();
  }
  cancelBtnClick(value: boolean) {
    this.saveDrawer = value;
    this.notCorrectDrawer = value;
  }

  getHospitalOverviewData() {
    this.loaderService.display(true);
    this.amplizService
      .hospitalOverviewDetails(this.paramsData)
      .subscribe((res) => {
        this.overviewResult = res;
        this.hospitalOverviewResult = this.overviewResult.hospitalOverviewInfo;

        this.loaderService.display(false);
      });
  }

  tabClick(ev: any) {
    var tabLabel = ev.tab.textLabel;
    if (tabLabel == "Finance") {
      this.getHospitalFinacialEarning();
    } else if (tabLabel == "Specification") {
      this.getHospitalSpecification();
    } else if (tabLabel == "Hospital Stats") {
      this.getHospitalStats();
    } else if (tabLabel == "Alliances") {
      this.getTotalStats();
    } else if (tabLabel.includes("Physician")) {
      this.setPage(1);
    } else if (tabLabel.includes("Executive")) {
      this.setPageE(1);
    }
  }

  vtabClick(ev: any) {
    this.vtabLabel = ev.tab.textLabel;
    if (this.vtabLabel == "Cost and Budget") {
      this.getHospitalFinancialCostandBudget();
    } else if (this.vtabLabel == "Income and EBITDA") {
      this.getHospitalFinancialIncomeandEbitda();
    } else if (this.vtabLabel == "Assets") {
      this.getHospitalFinancialAssets();
    } else if (this.vtabLabel == "Liabilities") {
      this.getHospitalFinancialLiabilities();
    } else if (this.vtabLabel == "Earnings") {
      this.getHospitalFinacialEarning();
    }
  }

  getHospitalSpecification() {
    this.dataResult = [];
    this.amplizService
      .getHospitalSpecification(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitaSpecification;
      });
  }

  getHospitalEarning() {
    this.dataResult = [];
    this.amplizService
      .getHospitalEarning(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res;
      });
  }

  getHospitalStats() {
    this.dataResult = [];
    this.amplizService
      .getHospitalStats(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitalStats;
      });
  }

  getTotalStats() {
    this.dataResult = [];
    this.amplizService.getTotalStats(this.paramsData).subscribe((res: any) => {
      this.dataResult = res.totalStats;
    });
  }

  getHospitalFinacialEarning() {
    this.dataResult = [];
    this.amplizService
      .getHospitalFinacialEarning(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitalFinancialEarnings;
      });
  }

  getHospitalFinancialCostandBudget() {
    this.dataResult = [];
    this.amplizService
      .getHospitalFinancialCostandBudget(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitalFinancialCostAndBudget;
      });
  }

  getHospitalFinancialIncomeandEbitda() {
    this.dataResult = [];
    this.amplizService
      .getHospitalFinancialIncomeandEbitda(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitalFinancialIncomeAndEBITDA;
      });
  }

  getHospitalFinancialAssets() {
    this.dataResult = [];
    this.amplizService
      .getHospitalFinancialAssets(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitalFinancialAssets;
      });
  }

  getHospitalFinancialLiabilities() {
    this.dataResult = [];
    this.amplizService
      .getHospitalFinancialLiabilities(this.paramsData)
      .subscribe((res: any) => {
        this.dataResult = res.hospitalFinancialLiabilities;
      });
  }

  setPage(page: any) {
    if (this.subscribed === true || page === 1) {
      this.loaderService.display(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.page = page;
      this.loaderService.display(true);
      this.offset = this.count * (page - 1);
      // this.subscribed = tru
      this.hospitalPhysicianParameter.offest = this.offset;
      this.hospitalPhysicianParameter.count = this.count;
      this.hospitalPhysicianParameter.hospitalId = this.paramsData;
      this.amplizService
        .getPhysicianListForHospital(this.hospitalPhysicianParameter)
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.unLockDiv = false;
            this.totalSearchResult = res.physicianInfoList;

            if (this.totalSearchResult.length > 0) {
              this.noResult = false;
              this.totalSize = this.physicianCount;
              this.pager = this.pagerservice.getPager(
                this.totalSize,
                page,
                this.count
              );
              this.pagedItems = this.totalSearchResult.slice(
                this.pager.startIndex,
                this.pager.endIndex + 1
              );
            } else {
              this.noResult = true;
              this.loaderService.display(false);
            }
          },
          (error) => {
            this.loaderService.display(false);
          }
        );
    } else {
      this.loaderService.display(false);
      this.unLockDiv = true;
      this.pager.currentPage = 2;
      this.offset = this.count * (this.pager.currentPage - 1);
    }
  }

  setPageE(page: any) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    if (this.subscribed === true || page === 1) {
      this.loaderService.display(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.page = page;
      this.loaderService.display(true);
      this.offset = this.count * (page - 1);
      // this.subscribed = tru
      this.hospitalPhysicianParameter.offest = this.offset;
      this.hospitalPhysicianParameter.count = this.count;
      this.hospitalPhysicianParameter.hospitalId = this.paramsData;
      this.amplizService
        .getExecutiveListForHospital(this.hospitalPhysicianParameter)
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.unLockDiv = false;
            this.totalSearchResult = res.executiveInfoList;

            if (this.totalSearchResult.length > 0) {
              this.noResult = false;
              this.totalSize = this.executiveCount;
              this.pager = this.pagerservice.getPager(
                this.totalSize,
                page,
                this.count
              );
              this.pagedItems = this.totalSearchResult.slice(
                this.pager.startIndex,
                this.pager.endIndex + 1
              );
            } else {
              this.noResult = true;
              this.loaderService.display(false);
            }
          },
          (error) => {
            this.loaderService.display(false);
          }
        );
    } else {
      this.loaderService.display(false);
      this.unLockDiv = true;
      this.pager.currentPage = 2;
      this.offset = this.count * (this.pager.currentPage - 1);
    }
  }

  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.subscriptions = res.Subscriptions;
          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;

            this.headerData = "Request Pricing";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
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
  openSocial(link: any) {
    window.open(link, "_blank").focus();
  }
}
