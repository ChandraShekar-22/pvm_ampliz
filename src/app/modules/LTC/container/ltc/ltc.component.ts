import { Component, OnInit } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LTC, LTCList } from '../../models/LTCModel';
import { SearchLTCModel } from '../../models/SearchLTCModel';
import { LTCDataService } from '../../services/ltc-data.service';
import { LTCService } from '../../services/ltc.service';

@Component({
  selector: 'app-ltc',
  templateUrl: './ltc.component.html',
  styleUrls: ['./ltc.component.css']
})
export class LtcComponent implements OnInit {
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
  selectedFilter: SearchLTCModel = new SearchLTCModel();
  ltcList: LTCList = new LTCList();
  savedLTCs: Array<any> = [];
  selectedLTCs: Array<any> = [];
  selectedLTCsInCurrentPage: Array<any> = [];
  noResult: boolean = false;
  showUpgradeCard: boolean = false;
  subscribed: boolean = false;
  netNewCount: number = 0;

  constructor(
    private ltcService: LTCService,
    private dataService: LTCDataService,
    private amplizService: AmplizService
  ) { }

  ngOnInit() {
    this.dataService.savedLTCs.subscribe((res: Array<LTC>) => {
      this.ltcList.updateLTCListFromSavedList(res);
      if (res.length > 0) {
        this.getNetNewCount();
      }
    });
    this.getLists();
    this.getDashboardDetails();
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
      this.selectedLTCsInCurrentPage.length<limit&&this.selectedLTCsInCurrentPage.length>0
    )
  }
  get allSelected() {
    const count = this.selectedFilter.searchType=='TOTAL'?this.totalItemCount:this.netNewCount;
    const limit = this.selectedFilter.limit> count?count:this.selectedFilter.limit
    return(
      this.selectedLTCsInCurrentPage.length>=limit&&!this.isPartiallySelected
    )
  }

  handleRecordsChange() {
    this.selectedFilter.offset = 0;
    // this.selectedFilter.savedListOffset = 0;
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];
    this.searchLTCsList();
    this.offset = 0;
  }

  async searchLTCsList(updatePreviousOffsets: boolean = true) {
    this.showLoader = true;
    if (updatePreviousOffsets) {
      this.selectedFilter.offset = this.previousOffsets[this.previousOffsets.length - 1] || 0;
      this.selectedFilter.savedListOffset = this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;
    }
    await this.getNetNewCount();
    this.ltcService.searchLTC(this.selectedFilter).subscribe(res => {
      this.dataService.addToSavedLTC([]);
      this.showLoader = false;
      this.ltcList.lTCInfoList = res.lTCInfoList;
      if (updatePreviousOffsets) {
        this.previousOffsets.push(res.offset);
        this.previousSavedOffsets.push(res.savedListOffset);
      }
      this.selectedLTCsInCurrentPage = this.ltcList.lTCInfoList.filter((ltcItem: any) => {
        return this.selectedLTCs.includes(ltcItem.ltcExecutiveId)
      }).map((item: any) => item.ltcExecutiveId);
      this.totalItemCount = res.totalResult;
      this.changeTabItems();
      this.savedLTCs = this.ltcList.lTCInfoList.filter((imageItem: any) => { return imageItem.leadSaveStatus == 'Saved' });
      if (this.ltcList.lTCInfoList.length !== 0) {
        this.noResult = false;
      } else {
        this.noResult = true;
      }
    },
      err => {
        this.ltcList.lTCInfoList = [];
        this.showLoader = false;
        this.noResult = true;
      });

  }

  getNetNewCount() {
    this.ltcService.searchLTCNetNew(this.selectedFilter).subscribe(netnew => {
      this.netNewCount = netnew.netNew || 0;
      this.changeTabItems();
    },
      err => {

      });
  }



  get decrementEnabled() {
    return this.offset > 0
  }

  decrementPage() {
    if (this.decrementEnabled) {
      this.showUpgradeCard = false;
      this.previousOffsets.splice(this.previousOffsets.length - 2, 2);
      this.previousSavedOffsets.splice(this.previousSavedOffsets.length - 2, 2);
      this.selectedLTCsInCurrentPage = [];
      this.selectedFilter.offset = this.selectedFilter.offset - this.selectedFilter.limit;
      this.offset = this.offset - this.selectedFilter.limit;
      this.searchLTCsList();
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
        this.selectedLTCsInCurrentPage = [];
        this.selectedFilter.offset = this.selectedFilter.offset + this.selectedFilter.limit;
        this.offset = this.offset + this.selectedFilter.limit;

        this.searchLTCsList();
      } else {
        this.showUpgradeCard = true;
        this.offset = this.offset + this.selectedFilter.limit
        this.selectedFilter.offset = this.offset;
      }
    }
  }

  clearSave() {
    this.selectedLTCsInCurrentPage = [];
    this.selectedLTCs = [];
  }

  handleSelectVisible(event) {
    
    this.selectedLTCs = this.selectedLTCs.filter(item => !this.selectedLTCsInCurrentPage.includes(item));
    this.selectedLTCsInCurrentPage = [];
    if (event == true) {
      this.ltcList.lTCInfoList.map((ltc: any) => {
        this.handleCheckboxChangeForAll(ltc);
        this.handleCurrentCheckboxChange(ltc);
      });
    }
  }
  handleCheckboxChange(event, ltc) {
    this.handleCheckboxChangeForAll(ltc);
    this.handleCurrentCheckboxChange(ltc);
  }

  //Handling checkbox change for all selection
  handleCurrentCheckboxChange(ltc) {
    const currentltcsIndex = this.selectedLTCsInCurrentPage.indexOf(ltc.ltcExecutiveId);
    if (currentltcsIndex == -1) {
      if (ltc.leadSaveStatus !== 'Saved') {
        this.selectedLTCsInCurrentPage.push(ltc.ltcExecutiveId);
      }
    } else {
      this.selectedLTCsInCurrentPage.splice(currentltcsIndex, 1);
    }
  }

  //Handling checkbox change for selection in current page
  handleCheckboxChangeForAll(ltc) {
    const ltcsIndex = this.selectedLTCs.findIndex(
      (item) => item == ltc.ltcExecutiveId
    );
    if (ltcsIndex == -1) {
      if (ltc.leadSaveStatus !== 'Saved') {
        this.selectedLTCs.push(ltc.ltcExecutiveId);
      }
    } else {
      this.selectedLTCs.splice(ltcsIndex, 1);
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
    // console.log(event);
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
    this.searchLTCsList();
  }

  getLists() {
    this.ltcService.getLists(0, 100, false).subscribe(res => {
      this.dataService.changeApacList(res.savedlistInfoList);
    });
  }
  handleLTCAddList() {
    this.selectedLTCs = [];
    this.selectedLTCsInCurrentPage = [];
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];
    this.searchLTCsList(false);
  }

  async handleFilterChanged(event: SearchLTCModel) {
    this.selectedFilter = event;
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];
    this.offset = 0;
    await this.saveDraftLeads();
    this.searchLTCsList();
  }

  saveDraftLeads() {
    this.ltcService.saveDraftLeads().subscribe(res => {

    },
      err => {
      })

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
