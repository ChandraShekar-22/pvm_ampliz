import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as moment from "moment";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { ActivatedRoute, Router } from "@angular/router";
import { param } from "jquery";
import { MessageService } from "../../../B2B/services/message.service";
import { DataService } from "../../services/data.service";
@Component({
  selector: "app-physician-overview",
  templateUrl: "./physician-overview.component.html",
  styleUrls: ["./physician-overview.component.css"],
})
export class PhysicianOverviewComponent implements OnInit, AfterViewInit {
  columnDefs: any;
  tab = 1;
  overviewResult: any;
  physicianOverviewResult: any;
  paramsData: any;
  DataResult: any;
  subscriptions = [];
  headerData: any = "";
  subscribed: boolean;
  currentCredit: any;
  saveDrawer: boolean = false;
  notCorrectDrawer: boolean = false;
  showButtonLoader: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    public amplizService: AmplizService,
    private messageService: MessageService,
    private dataService: DataService
  ) {
    this.columnDefs = [
      {
        headerName: "Drug Name",
      },
      {
        headerName: "Total claim",
      },
      {
        headerName: "Total Drug Cost",
      },
      {
        headerName: "Total Drug Cost 65+",
      },
    ];
  }

  get phyHosInfo() {
    return this.physicianOverviewResult.physicianHospitalInfoData;
  }

  get phyDrugInfo() {
    return this.DataResult;
  }

  get isBlankHospitalInfo() {
    if (
      !this.phyHosInfo.webAddress &&
      !this.phyHosInfo.state &&
      !this.phyHosInfo.hospitalFax &&
      !this.phyHosInfo.country &&
      !this.phyHosInfo.city &&
      !this.phyHosInfo.address
    ) {
      return true;
    } else {
      return false;
    }
  }

  // get isBlankPhysicianDrugInfo() {
  //   if (this.phyDrugInfo[0].prescribingDrugName =='' && this.phyDrugInfo[0].totalClaims == '') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  get showSaveButton() {
    return this.physicianOverviewResult.physicianInfoData.leadSaveStatus !== 'Saved'
  }
  get saveButtonText() {
    return this.physicianOverviewResult.physicianInfoData.leadSaveStatus == 'NotSaved' ? 'View' : 'Save'
  }
  ngOnInit() {
    this.paramsData = this.activatedRoute.snapshot.params["physicianId"];
    this.getPhysicianOverviewData();
    this.getPrescriberDrug();
  }
  ngAfterViewInit() {
    this.getDashboardDetails();
  }
  ngTab(value: any) {
    this.tab = value;
  }
  cancelBtnClick(value: boolean) {
    this.saveDrawer = value;
    this.notCorrectDrawer = value;
  }
  getPhysicianOverviewData() {
    this.amplizService
      .physicianOverviewDetails(this.paramsData)
      .subscribe((res) => {
        this.overviewResult = res;

        this.physicianOverviewResult = res.physicianOverviewInfo;
      });
  }
  refreshedData(ev: any) {
    if (ev === true) {
      this.getPhysicianOverviewData();
    }
  }

  tabClick(ev: any) {
    var tabLabel = ev.tab.textLabel;
    if (tabLabel === "Hospital Information") {
      this.getPhysicianOverviewData();
    } else if (tabLabel === "This Prescriber's Drugs") {
      this.getPrescriberDrug();
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
          this.currentCredit = res.CurrentCredits;
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

  getPrescriberDrug() {
    this.amplizService
      .getPhysicianPrescriberDrugDetail(this.paramsData)
      .subscribe((el: any) => {
        this.DataResult = el.physicianDrugInfo;
      });
  }

  request(request: any) {
    const body = {
      comid: "0",
      url: window.location.href,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe((res) => {
      this.messageService.display(true, res.msg);
    });
  }

  viewPhysicianFromList() {
    const physicianId = this.physicianOverviewResult.physicianInfoData.physicianId;
    this.showButtonLoader = true;
    this.amplizService
      .viewPhysicianFromList(physicianId, null).subscribe(res => {
        this.amplizService.physicianOverviewDetails(physicianId).subscribe(res => {
          this.showButtonLoader = false;
          this.overviewResult = res;
          this.physicianOverviewResult = res.physicianOverviewInfo;
        },
          err => {
            this.showButtonLoader = false;
          });
      }, err => {
        this.showButtonLoader = false;
      });
  }

  handleSaveButtonPress() {
    const leadSaveStatus = this.physicianOverviewResult.physicianInfoData.leadSaveStatus;
    if (leadSaveStatus == 'NotSaved') {
      this.viewPhysicianFromList();
    } else {
      this.saveDrawer = true;
    }

  }

}
