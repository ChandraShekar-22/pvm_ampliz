import { Component, Input, OnInit } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { ImagingList } from '../../models/ImagingModel';
import { SearchImagingModel } from '../../models/SearchImagingModel';
import { ImagingDataService } from '../../services/imaging-data.service';
import { ImagingService } from '../../services/imaging.service';

@Component({
  selector: "app-imaging-center",
  templateUrl: "./imaging-center.component.html",
  styleUrls: [
    "./imaging-center.component.css",
    "../imaging-center-executive/imaging-center-executive.component.css",
  ],
})
export class ImagingCenterComponent implements OnInit {
  @Input() isSubscribed: boolean = false;
  tabItems = [{ name: `Total(0)`, icon: { name: "" } }];
  selectedFilter: SearchImagingModel = new SearchImagingModel();
  imagingList: ImagingList = new ImagingList();
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
    private dataService: ImagingDataService,
    private amplizService: AmplizService
  ) {}

  ngOnInit() {
    this.getDashboardDetails();
  }

  handleFilterChanged(event: SearchImagingModel) {
    this.selectedFilter = event;
    this.searchImagingsList();
  }

  async searchImagingsList() {
    this.showLoader = true;

    // await this.getNetNewCount();
    this.imagingService.searchImagings(this.selectedFilter).subscribe(
      (res) => {
        // this.dataService.addToSavedContacts([]);
        this.showLoader = false;
        this.imagingList.imagingCenterInfoList = res.imagingCenterInfoList;
        this.totalItemCount = res.totalResult;
        this.changeTabItems();
      },
      (err) => {
        this.imagingList.imagingCenterInfoList = [];
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
