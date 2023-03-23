import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { B2bService } from "../../../services/b2b.service";
import { DataService } from "../../../services/data.service";
import { SearchContactInput } from "../../../models/SearchContactModel";
import { SearchCompanyInput } from "../../../models/SearchCompany";
@Component({
  selector: "app-recent-view-more",
  templateUrl: "./recent-view-more.component.html",
  styleUrls: ["./recent-view-more.component.css"],
})
export class RecentViewMoreComponent implements OnInit, OnDestroy {
  @Input() recentViewMore: boolean = true;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  offset: number = 0;
  count: number = 10;
  recentSearchList: Array<any> = [];
  dateWiseSearchList: any = {};
  datesList: Array<any> = [];
  searchContactInput: SearchContactInput = new SearchContactInput();
  searchCompanyInput: SearchCompanyInput = new SearchCompanyInput();
  recentViewmoreElmnt: any;
  searchCred: any = {};
  saveSearchListDrawer: boolean = false;
  saveSearchType: string = "";
  loading: boolean = true;
  filterDatas = [
    {
      title: "Company Name",
      key: "companyList",
      type: "array",
    },
    {
      title: "Full name",
      key: "fullNameList",
      type: "array",
    },
    {
      title: "Country List",
      key: "countryList",
      type: "array",
      subkey: "country",
    },
    {
      title: "State List",
      key: "stateList",
      type: "array",
      subkey: "stateFullName",
    },
    {
      title: "City List",
      key: "cityList",
      type: "array",
      subkey: "city",
    },
    {
      title: "Included title",
      key: "titleInclude",
      type: "array",
    },
    {
      title: "Excluded title",
      key: "titleExclude",
      type: "array",
    },
    {
      title: "Included industry",
      key: "industryInclude",
      type: "array",
    },
    {
      title: "Excluded industry",
      key: "industryExclude",
      type: "array",
    },
    {
      title: "Included departments",
      key: "deptInclude",
      type: "array",
    },
    {
      title: "Excluded departments",
      key: "deptExclude",
      type: "array",
    },
    {
      title: "Seniority",
      key: "seniority",
      type: "array",
    },
    {
      title: "Included Skill",
      key: "skillInclude",
      type: "array",
    },
    {
      title: "Excluded Skill",
      key: "skillExclude",
      type: "array",
    },
    {
      title: "Employee Range",
      key: "employeeRangeList",
      type: "array",
    },
    {
      title: "Revenue",
      key: "revenue",
      type: "Array",
    },
    {
      title: "Domain",
      key: "domainList",
      type: "text",
    },
    {
      title: "Employee Range",
      key: "employeeRange",
      type: "array",
    },
    {
      title: "Technology Excluded",
      key: "techExclude",
      type: "array",
    },

    {
      title: "Technology Included",
      key: "techInclude",
      type: "array",
    },
  ];

  constructor(
    public b2bService: B2bService,
    public router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getSearchData();
    this.scrollHandler();
  }

  ngOnDestroy() {
    this.recentViewmoreElmnt.removeEventListener("scroll", () => {});
  }

  scrollHandler() {
    this.recentViewmoreElmnt = document.getElementById("recentViewmoreScroll");
    const that = this;
    this.recentViewmoreElmnt.addEventListener("scroll", function (e) {
      that.onScrollRecent(e);
    });
  }
  getSearchData() {
    this.loading = true;
    this.b2bService.getRecentSavedSearch(this.offset, this.count).subscribe(
      (res) => {
        // console.log(res);
        if (res.searchReportList.length > 0) {
          this.recentSearchList = res.searchReportList;
          const tempContactSearchParams = this.recentSearchList.map(
            (recentItems) => {
              if (recentItems.contactSearchParams !== null) {
                return recentItems.contactSearchParams;
              }
            }
          );
          if (tempContactSearchParams.length > 0) {
            tempContactSearchParams.map((item) => {
              if (typeof item !== "undefined") {
                if (item.seniority.length > 0) {
                  const seniority = item.seniority.map((el) => {
                    return el;
                  });
                  const filteredSeniority =
                    this.dataService.handleSeniorityByName(seniority);
                  item.seniority = filteredSeniority;
                }
              }
            });
          }

          res.searchReportList.map((item) => {
            // console.log(new Date(item.searchAt).toISOString().split("T")[0]);
            const savedTime = new Date(item.searchAt)
              .toISOString()
              .split("T")[0];
            const arr = this.dateWiseSearchList[savedTime] || [];
            // console.log(arr, item, "Arr and item");
            if (
              arr.findIndex(
                (arrItem) => arrItem.searchReportId == item.searchReportId
              ) == -1
            ) {
              let obj = {};
              let addedSearchKeys = [];
              if (item.searchType === "Contact") {
                // console.log(item.contactSearchParams);
                const searchObj = item["contactSearchParams"];
                addedSearchKeys = Object.keys(item.contactSearchParams).filter(
                  (searchItems) =>
                    searchObj[searchItems] &&
                    searchObj[searchItems] !== null &&
                    searchObj[searchItems] !== "" &&
                    searchObj[searchItems].length > 0
                );
              } else {
                // console.log(item.companySearchParams);
                const searchObj = item["companySearchParams"];
                addedSearchKeys = Object.keys(item.companySearchParams).filter(
                  (searchItems) =>
                    searchObj[searchItems] &&
                    searchObj[searchItems] !== null &&
                    searchObj[searchItems] !== "" &&
                    searchObj[searchItems].length > 0
                );
              }
              const includedSearchChips = this.filterDatas.filter(
                (filterItem) => addedSearchKeys.includes(filterItem.key)
              );
              obj = {
                ...item,
                includedSearchChips,
              };
              // console.log(obj);
              arr.push(obj);
            }
            this.dateWiseSearchList[savedTime] = arr;
          });
          // console.log(this.dateWiseSearchList);
          this.datesList = Object.keys(this.dateWiseSearchList);
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  cancelSaveDiv() {
    this.recentViewMore = false;
    setTimeout(() => {
      this.cancelBtnClick.emit(false);
    }, 300);
  }
  onScrollRecent(event: any) {
    // visible height + pixel scrolled >= total height
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      this.offset = this.offset + 1;
      this.getSearchData();
      // console.log("End");
    }
  }
  searchContact(searchBody: any) {
    // console.log(searchBody);
    // this.dataService.searchOrRecentTapped(true);
    if (searchBody.searchType == "Contact") {
      const contactObj = this.searchContactInput.fromJson(
        searchBody.contactSearchParams
      );
      if (contactObj.seniority.length > 0) {
        const senioirty = contactObj.seniority.map((el) => {
          return el;
        });
        const filteredSeniority =
          this.dataService.handleSeniorityById(senioirty);

        contactObj.seniority = filteredSeniority;
      }
      this.dataService.passSearchContactInput(contactObj);
      this.dataService.changeSelectedTab(0);
    } else {
      const companyObj = this.searchCompanyInput.fromJson(
        searchBody.companySearchParams
      );
      this.dataService.passSearchCompanyInput(companyObj);
      this.dataService.changeSelectedTab(1);
    }
    this.dataService.makeSavesearchVisible(false);
    this.dataService.makeRecentsearchVisible(false);
    this.cancelSaveDiv();
  }

  handleSaveSearchPress(searchData) {
    // console.log(searchData);
    this.saveSearchListDrawer = true;
    this.saveSearchType = searchData.searchType;
    if (this.saveSearchType == "Contact") {
      const bdy: SearchContactInput = new SearchContactInput();
      this.searchCred = bdy.fromJson(searchData.contactSearchParams);
    } else {
      const bdy: SearchCompanyInput = new SearchCompanyInput();
      this.searchCred = bdy.fromJson(searchData.companySearchParams);
    }
  }
  cancelSaveSearch() {
    this.saveSearchListDrawer = false;
  }
  handleSearchSave() {
    this.cancelSaveSearch();
    this.cancelSaveDiv();
    this.dataService.makeSavesearchVisible(true);
  }
}

