import { Component, Input, OnInit } from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { ImagingList } from "src/app/modules/ImagingCenter/models/ImagingModel";
import { SearchImagingModel } from "src/app/modules/ImagingCenter/models/SearchImagingModel";
import { ImagingDataService } from "src/app/modules/ImagingCenter/services/imaging-data.service";
import { ImagingService } from "src/app/modules/ImagingCenter/services/imaging.service";
import { PayorExecutiveList } from "../../models/payor-executive.model";
import { SearchPayourModel } from "../../models/search-payor-model.model";
import { DataService } from "../../service/data.service";
import { PayorService } from "../../service/payor.service";

@Component({
  selector: "app-payor-company",
  templateUrl: "./payor-company.component.html",
  styleUrls: ["./payor-company.component.css"],
})
export class PayorCompanyComponent implements OnInit {
  @Input() isSubscribed: boolean = false;
  tabItems = [{ name: `Total(0)`, icon: { name: "" } }];
  selectedFilter: SearchPayourModel = new SearchPayourModel();
  imagingList: PayorExecutiveList = new PayorExecutiveList();
  pageNumberOptions: Array<any> = [5, 10, 25, 50];
  totalItemCount: number = 0;
  showLoader: boolean = false;
  noResult: boolean = false;
  showUpgradeCard: boolean = false;
  subscribed: boolean = false;

  get decrementEnabled() {
    return this.selectedFilter.offset > 0;
  }

  get incrementEnabled() {
    return (
      this.selectedFilter.offset + this.selectedFilter.limit <
        this.totalItemCount && !this.showUpgradeCard
    );
  }
  constructor(
    private imagingService: ImagingService,
    private dataService: DataService,
    private amplizService: AmplizService,
    private payorService: PayorService
  ) {}

  ngOnInit() {
    this.getDashboardDetails();
  }

  handleFilterChanged(event: SearchPayourModel) {
    this.selectedFilter = event;
    this.searchImagingsList();
  }

  async searchImagingsList() {
    this.showLoader = true;

    // await this.getNetNewCount();
    this.payorService
      .searchMCO({
        ...this.selectedFilter,
        industry: this.selectedFilter.industry
          ? this.selectedFilter.industry
          : [],
      })
      .subscribe(
        (res) => {
          // this.dataService.addToSavedContacts([]);
          this.showLoader = false;
          this.imagingList.payorExecutiveInfoList = res.mcoInfoList;
          this.totalItemCount = res.totalResult;
          this.changeTabItems();
          if (this.imagingList.payorExecutiveInfoList.length !== 0) {
            this.noResult = false;
          } else {
            this.noResult = true;
          }
        },
        (err) => {
          this.imagingList.payorExecutiveInfoList = [];
          this.showLoader = false;
          this.noResult = true;
        }
      );
  }

  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    const refreshToken = await localStorage.getItem("refresh_token");
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          let subscriptions = res.Subscriptions;
          if (subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
          }
          if (subscriptions[0].SubscriptionType == "Paid") {
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
          }
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
  handleRecordsChange() {
    this.selectedFilter.offset = 0;
    this.searchImagingsList();
  }
  changeTabItems() {
    this.tabItems[0].name = `Total (${this.numberWithCommas(
      this.totalItemCount
    )})`;
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  incrementPage() {
    if (this.incrementEnabled) {
      this.selectedFilter.offset =
        this.selectedFilter.offset + this.selectedFilter.limit;
      if (this.subscribed) {
        this.showUpgradeCard = false;
        this.searchImagingsList();
      } else {
        this.showUpgradeCard = true;
      }
    }
  }

  decrementPage() {
    if (this.decrementEnabled) {
      this.showUpgradeCard = false;
      this.selectedFilter.offset =
        this.selectedFilter.offset - this.selectedFilter.limit;
      this.searchImagingsList();
    }
  }
}
