import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { ImagingExecutive, ImagingExecutiveList } from '../../models/ImagingExecutivesModel';
import { SearchImagingExecutivesModel } from '../../models/SearchImagingExecutivesModel';
import { ImagingDataService } from '../../services/imaging-data.service';
import { ImagingService } from '../../services/imaging.service';

@Component({
  selector: 'app-imaging-center-executive',
  templateUrl: './imaging-center-executive.component.html',
  styleUrls: ['./imaging-center-executive.component.css']
})
export class ImagingCenterExecutiveComponent implements OnInit, OnDestroy {
  showLoader: boolean = true;
  tabItems = [
    { name: `Total (0)`, icon: { name: "" } },
    { name: `Net New (0)`, icon: { name: "" } },
  ];

  offset: number = 0;
  currentTab: number = 0;
  totalItemCount: number = 0;
  pageNumberOptions: Array<any> = [5, 10, 25, 50];
  previousOffsets: Array<any> = [];
  previousSavedOffsets: Array<any> = [];
  isSubscribed: any = true;
  selectedFilter: SearchImagingExecutivesModel = new SearchImagingExecutivesModel();
  imagingList: ImagingExecutiveList = new ImagingExecutiveList();
  savedImagings: Array<any> = [];
  selectedImagings: Array<any> = [];
  selectedImagingsInCurrentPage: Array<any> = [];
  noResult: boolean = false;
  showUpgradeCard: boolean = false;
  subscribed: boolean = false;
  netNewCount: number = 0;

  constructor(
    private imagingService: ImagingService,
    private dataService: ImagingDataService,
    private amplizService: AmplizService
  ) { }

  ngOnInit() {
    this.dataService.savedImagings.subscribe((res: Array<ImagingExecutive>) => {
      this.imagingList.updateImagingssListFromSavedList(res);
      if (res.length > 0) {
        this.getNetNewCount();
      }
    });
    this.getLists();
    this.getDashboardDetails();
  }
  ngOnDestroy(): void {
  }
  dateChanged(event) {
  }

  get paginationEndCount() {
    const count = this.selectedFilter.searchType=='TOTAL'?this.totalItemCount:this.netNewCount;
    return (
      this.offset + this.selectedFilter.limit < count ? this.offset + this.selectedFilter.limit+1 :
      count
    )
  }

  get isPartiallySelected() {
    const count = this.selectedFilter.searchType=='TOTAL'?this.totalItemCount:this.netNewCount;
    const limit = this.selectedFilter.limit> count?count:this.selectedFilter.limit
    return (
      this.selectedImagingsInCurrentPage.length<limit&&this.selectedImagingsInCurrentPage.length>0
    )
  }
  get allSelected() {
    const count = this.selectedFilter.searchType=='TOTAL'?this.totalItemCount:this.netNewCount;
    const limit = this.selectedFilter.limit> count?count:this.selectedFilter.limit
    return(
      this.selectedImagingsInCurrentPage.length>=limit&&!this.isPartiallySelected
    )
  }

  

  handleRecordsChange() {
    this.selectedFilter.offset = 0;
    // this.selectedFilter.savedListOffset = 0;
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];

    this.searchImagingsList();
    this.offset = 0;
  }


  async searchImagingsList(updatePreviousOffsets: boolean = true) {
    this.showLoader = true;
    if (updatePreviousOffsets) {
      this.selectedFilter.offset = this.previousOffsets[this.previousOffsets.length - 1] || 0;
      this.selectedFilter.savedListOffset = this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;
    }

    await this.getNetNewCount();
    this.imagingService.searchImagingExecutives(this.selectedFilter).subscribe(res => {
      this.dataService.addToSavedContacts([]);
      this.showLoader = false;
      if (updatePreviousOffsets) {
        this.previousOffsets.push(res.offset);
        this.previousSavedOffsets.push(res.savedListOffset);
      }
      this.imagingList.imagingCenterExecutiveInfoList = res.imagingCenterExecutiveInfoList;
      this.selectedImagingsInCurrentPage = this.imagingList.imagingCenterExecutiveInfoList.filter((imagingItem: any) => {
        return this.selectedImagings.includes(imagingItem.icExecutiveId)
      }).map((item: any) => item.icExecutiveId);
      this.totalItemCount = res.totalResult;
      this.changeTabItems();
      this.savedImagings = this.imagingList.imagingCenterExecutiveInfoList.filter((imageItem: any) => { return imageItem.leadSaveStatus == 'Saved' });
      if (this.imagingList.imagingCenterExecutiveInfoList.length !== 0) {
        this.noResult = false;
      } else {
        this.noResult = true;
      }
    },
      err => {
        this.imagingList.imagingCenterExecutiveInfoList = [];
        this.showLoader = false;
        this.noResult = true;
      });

  }


  get decrementEnabled() {
    return this.offset > 0
  }

  getNetNewCount() {
    this.imagingService.searchImagingExecutivesNetNew(this.selectedFilter).subscribe(netnew => {
      this.netNewCount = netnew.netNew || 0;
      this.changeTabItems();
    },
      err => {

      });
  }

  decrementPage() {
    if (this.decrementEnabled) {
      this.showUpgradeCard = false;
      this.previousOffsets.splice(this.previousOffsets.length - 2, 2);
      this.previousSavedOffsets.splice(this.previousSavedOffsets.length - 2, 2);
      this.selectedImagingsInCurrentPage = [];
      this.selectedFilter.offset = this.selectedFilter.offset - this.selectedFilter.limit;
      this.offset = this.offset - this.selectedFilter.limit;
      this.searchImagingsList();
    }
  }

  get incrementEnabled() {
    return this.offset + this.selectedFilter.limit <
      this.totalItemCount && !this.showUpgradeCard
  }

  incrementPage() {
    if (
      this.incrementEnabled
    ) {
      if (this.subscribed) {
        this.showUpgradeCard = false;
        this.selectedImagingsInCurrentPage = [];
        this.selectedFilter.offset = this.selectedFilter.offset + this.selectedFilter.limit;
        this.offset = this.offset + this.selectedFilter.limit;

        this.searchImagingsList();
      } else {
        this.showUpgradeCard = true;
        this.offset = this.offset + this.selectedFilter.limit
        this.selectedFilter.offset = this.offset;
      }
    }
  }

  clearSave() {
    this.selectedImagingsInCurrentPage = [];
    this.selectedImagings = [];
  }

  handleSelectVisible(event) {
    this.selectedImagings = this.selectedImagings.filter(item => !this.selectedImagingsInCurrentPage.includes(item));
    this.selectedImagingsInCurrentPage = [];
    if (event == true) {
      this.imagingList.imagingCenterExecutiveInfoList.map((imaging: any) => {
        this.handleCheckboxChangeForAll(imaging);
        this.handleCurrentCheckboxChange(imaging);
      });
    }
  }
  handleCheckboxChange(event, imaging) {
    this.handleCheckboxChangeForAll(imaging);
    this.handleCurrentCheckboxChange(imaging);
  }

  //Handling checkbox change for all selection
  handleCurrentCheckboxChange(imaging) {
    const currentimagingsIndex = this.selectedImagingsInCurrentPage.indexOf(imaging.icExecutiveId);
    if (currentimagingsIndex == -1) {
      if (imaging.leadSaveStatus !== 'Saved') {
        this.selectedImagingsInCurrentPage.push(imaging.icExecutiveId);
      }
    } else {
      this.selectedImagingsInCurrentPage.splice(currentimagingsIndex, 1);
    }
  }

  //Handling checkbox change for selection in current page
  handleCheckboxChangeForAll(imaging) {
    const imagingsIndex = this.selectedImagings.findIndex(
      (item) => item == imaging.icExecutiveId
    );
    if (imagingsIndex == -1) {
      if (imaging.leadSaveStatus !== 'Saved') {
        this.selectedImagings.push(imaging.icExecutiveId);
      }
    } else {
      this.selectedImagings.splice(imagingsIndex, 1);
    }
  }

  peopleCheckboxDisabled(item) {
    return item.leadSaveStatus == 'Saved' || !this.subscribed
  }
  changeTabItems() {

    this.tabItems[0].name = `Total (${this.numberWithCommas(this.totalItemCount)})`;
    this.tabItems[1].name = `Net New (${this.numberWithCommas(this.netNewCount)})`;
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleTabChange(event) {
    this.currentTab = event;
    if (event == 0) {
      this.selectedFilter.searchType = "TOTAL";
    } else {
      this.selectedFilter.searchType = "NETNEW";
    }
    this.selectedFilter.offset = 0;
    this.offset = 0;
    // this.selectedFilter.savedListOffset = 0;

    // this.currentItemNumber = 0;
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];
    this.searchImagingsList();
  }

  getLists() {
    this.imagingService.getLists(0, 100, false).subscribe(res => {
      this.dataService.changeApacList(res.savedlistInfoList);
    });
  }
  handleImagingAddList() {
    this.selectedImagings = [];
    this.selectedImagingsInCurrentPage = [];

    this.searchImagingsList(false);
  }

  async handleFilterChanged(event: SearchImagingExecutivesModel) {
    this.selectedFilter = event;
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];
    this.offset = 0;
    await this.saveDraftLeads();
    this.searchImagingsList();

  }
  saveDraftLeads() {
    this.imagingService.saveDraftLeads().subscribe(res => {
    }, err => {
    });
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
}
