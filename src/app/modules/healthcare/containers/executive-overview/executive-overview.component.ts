import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { DataService } from "../../services/data.service";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: "app-executive-overview",
  templateUrl: "./executive-overview.component.html",
  styleUrls: ["./executive-overview.component.css"],
})
export class ExecutiveOverviewComponent implements OnInit {
  tab = 1;
  paramsData: any;
  overviewResult: any;
  executiveOverviewResult: any;
  currentCredit: any;
  saveDrawer: boolean = false;
  notCorrectDrawer: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    public amplizService: AmplizService,
    private loaderService: LoaderService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.paramsData = this.activatedRoute.snapshot.params["executiveId"];
    this.getExecutiveOverviewData();
    this.getDashboardDetails();
  }


  get showSaveButton() {
    return this.executiveOverviewResult.healthExecutiveInfoData.leadSaveStatus !== 'Saved'
  }
  get saveButtonText() {
    return this.executiveOverviewResult.healthExecutiveInfoData.leadSaveStatus == 'NotSaved' ? 'View' : 'Save'
  }
  cancelBtnClick(value: boolean) {
    this.saveDrawer = value;
    this.notCorrectDrawer = value;
  }
  refreshedData(ev: any) {
    if (ev === true) {
      this.getExecutiveOverviewData();
    }
  }
  ngTab(value: any) {
    this.tab = value;
  }
  getExecutiveOverviewData() {
    this.amplizService
      .executiveOverviewDetails(this.paramsData)
      .subscribe((res) => {
        this.overviewResult = res;
        //
        this.executiveOverviewResult =
          res.healthExecutiveOverviewInfo;
        //
      });
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.currentCredit = res.CurrentCredits;
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
        }
      );
    } else {
      this.amplizService.logout();
    }
  }
  handleSaveButtonPress() {
    const leadSaveStatus = this.executiveOverviewResult.healthExecutiveInfoData.leadSaveStatus;
    if (leadSaveStatus == 'NotSaved') {
      this.viewExecutiveFromList();
    } else {
      this.saveDrawer = true;
    }

  }

  viewExecutiveFromList() {
    const executiveId = this.executiveOverviewResult.healthExecutiveInfoData.executiveId;
    this.loaderService.display(true);
    this.amplizService
      .viewExecutiveFromList(executiveId, null).subscribe(res => {
        this.amplizService.executiveOverviewDetails(executiveId).subscribe(res => {
          this.loaderService.display(false);
          this.overviewResult = res;
          this.executiveOverviewResult = res.healthExecutiveOverviewInfo;
          this.dataService.addToSavedExecutive([res.healthExecutiveOverviewInfo.healthExecutiveInfoData]);
        },
          err => {
            this.loaderService.display(false);
          });
      }, err => {
        this.loaderService.display(false);
      });
  }
}
