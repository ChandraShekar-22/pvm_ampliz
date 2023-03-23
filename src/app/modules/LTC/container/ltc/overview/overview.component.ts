import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LTCService } from "../../../services/ltc.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  paramsData: any;
  showButtonLoader: boolean = false;
  overviewDetails: any;
  overviewData: any;
  moreInfoData: any;
  isOverviewAvailable: boolean = true;
  isMoreInfoAvailable: boolean = true;
  showSaveButton: boolean = false;
  saveDrawer: boolean = false;
  notCorrectDrawer: boolean = false;
  notCorrectReasons: Array<any> = ['Name of Center','Title','Department','Seniority','Name','LTC type','Location'];
  DataResult: Array<any> = [];
  currentCredit: any = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private ltcServices: LTCService,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private amplizService: AmplizService
  ) {}

  ngOnInit() {
    this.paramsData = this.activatedRoute.snapshot.params["ltcExecutiveId"];
    this.getLtcCenterDetailsData();
    this.getLtcMoreInfoData();
    this.getLtcCenterOverviewData();
  }
  getLtcCenterDetailsData() {
    this.ltcServices.getLTCCenterDetails(this.paramsData).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.overviewDetails = res.ltcInfo;
        if (res.ltcInfo.leadSaveStatus !== "Saved") {
          this.showSaveButton = true;
        }
        
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  getLtcCenterOverviewData() {
    this.ltcServices.getLtcCenterOverview(this.paramsData).subscribe((res) => {
      this.isOverviewAvailable = true;
      this.overviewData = res.ltcOverviewInfo;
      const keys = Object.keys(res.ltcOverviewInfo);
      
      keys.forEach(item => {
        if(!this.overviewData[item]||this.overviewData[item]==''||this.overviewData[item]==null) {
          delete this.overviewData[item];
        }
      });
      if (Object.keys(this.overviewData).length == 0) {
        this.isOverviewAvailable = false;
      }
    });
  }
  getLtcMoreInfoData() {
    this.ltcServices.getLtcCenterMoreInfo(this.paramsData).subscribe((res) => {
      this.isMoreInfoAvailable = true;
      this.moreInfoData = res.ltcMoreInfo;
      const keys = Object.keys(res.ltcMoreInfo);
      keys.forEach(item => {
        if(!this.moreInfoData[item]||this.moreInfoData[item]==''||this.moreInfoData[item]==null) {
          delete this.moreInfoData[item];
        }
      });

      if (Object.keys(this.moreInfoData).length == 0) {
        this.isMoreInfoAvailable = false;
      }
    });
  }
  // get showSaveButton() {
  //        return this.imagingOverviewResult.leadSaveStatus !== "Saved";
  // }
  get saveButtonText() {
    return this.overviewDetails.leadSaveStatus == "NotSaved" ? "View" : "Save";
  }
  viewLtcCenterFromList() {
    const body = {
      ltcExecutiveId: this.overviewDetails.ltcExecutiveId,
    };
    this.showButtonLoader = true;
    this.ltcServices.viewLTCFromList(body).subscribe(
      (res) => {
        this.messageService.display(true, "Successfully added to the list");
        this.ltcServices
          .getLTCCenterDetails(this.overviewDetails.ltcExecutiveId)
          .subscribe(
            (overview) => {
              this.showButtonLoader = false;
              this.overviewDetails = overview.ltcInfo;
              if (overview.ltcInfo.leadSaveStatus !== "Saved") {
                this.showSaveButton = true;
              }
            },
            (err) => {
              this.showButtonLoader = false;
            }
          );
      },
      (err) => {
        this.showButtonLoader = false;
      }
    );
  }
  handleSaveButtonPress() {
    const leadSaveStatus = this.overviewDetails.leadSaveStatus;
    if (leadSaveStatus == "NotSaved") {
      this.viewLtcCenterFromList();
    } else {
      this.saveDrawer = true;
    }
  }
  cancelBtnClick(value: boolean) {
    this.saveDrawer = value;
    this.notCorrectDrawer = value;
  }
  refreshedData(ev: any) {
    if (ev === true) {
      this.loaderService.display(true);
      setTimeout(() => {
        this.getLtcCenterDetailsData();
      }, 200);
    }
  }
  

  request(request: any) {
    this.loaderService.display(true);
    const body = {
      comid: "0",
      url: window.location.href,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe((res) => {
      this.loaderService.display(false);
      this.messageService.display(true, res.msg);
    },err => {
      this.loaderService.display(true);
    });
  }
  tabClick(event) {}
}
