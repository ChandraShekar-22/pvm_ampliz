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
  selector: "app-saved-view-more",
  templateUrl: "./saved-view-more.component.html",
  styleUrls: ["./saved-view-more.component.css"],
})
export class SavedViewMoreComponent implements OnInit, OnDestroy {
  @Input() savedSearchViewMore: boolean = true;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  offset: number = 0;
  count: number = 10;
  savedSearchList: Array<any> = [];
  dateWiseSearchList: any = {};
  datesList: Array<any> = [];
  searchContactInput: SearchContactInput = new SearchContactInput();
  searchCompanyInput: SearchCompanyInput = new SearchCompanyInput();
  savedViewmoreElmnt: any;
  loading: boolean = true;
  filterDatas = [
    {
      title: "Company Name",
      key: "companyList",
      type: "array",
    },
    {
      title: "Full name",
      key: "fullName",
      type: "text",
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
      title: "Employee Range",
      key: "employeeRangeList",
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
    this.savedViewmoreElmnt.removeEventListener("scroll", () => {});
  }

  scrollHandler() {
    this.savedViewmoreElmnt = document.getElementById(
      "scrollingContainerViewMore"
    );
    const that = this;
    this.savedViewmoreElmnt.addEventListener("scroll", function (e) {
      that.onScroll(e);
    });
  }
  getSearchData() {
    this.loading = true;
    this.b2bService.getSavedSearch(this.offset, this.count).subscribe(
      (res) => {
        // console.log(res);

        // Converting seniority id to name
        if (res.savedSearchList.length > 0) {
          this.savedSearchList = res.savedSearchList;
          // const tempContactSearchParams = this.savedSearchList.map(
          //   (recentItems) => {
          //     if (recentItems.contactSearchParams !== null) {
          //       return recentItems.contactSearchParams;
          //     }
          //   }
          // );
          // if (tempContactSearchParams.length > 0) {
          //   tempContactSearchParams.map((item) => {
          //     if (typeof item !== "undefined") {
          //       if (item.seniority.length > 0) {
          //         const seniority = item.seniority.map((el) => {
          //           return el;
          //         });
          //         const filteredSeniority =
          //           this.dataService.handleSeniorityByName(seniority);
          //         item.seniority = filteredSeniority;
          //       }
          //     }
          //   });
          // }
          // this.savedSearchList.map((item) => {
          //   if (item.seniority.length > 0) {
          //     const seniority = item.seniority.map((el) => {
          //       return el;
          //     });
          //     const filteredSeniority =
          //       this.dataService.handleSeniorityByName(seniority);
          //     item.seniority = filteredSeniority;
          //   }
          // });
          // res.savedSearchList.senioirty = this.filteredSeniorityList;
          res.savedSearchList.map((item) => {
            // console.log(new Date(item.savedDateTime).toISOString().split('T')[0]);
            const savedTime = new Date(item.savedDateTime).toISOString().split('T')[0];
            const arr = this.dateWiseSearchList[savedTime] || [];
            if (arr.findIndex((arrItem) => arrItem.savedSearchId == item.savedSearchId) == -1) {
              const addedSearchKeys = Object.keys(item).filter(
                (searchItems) => item[searchItems] !== null && item[searchItems] !== '' && item[searchItems].length > 0
              );
              const includedSearchChips = this.filterDatas.filter((filterItem) =>
                addedSearchKeys.includes(filterItem.key)
              );
              const obj = {
                ...item,
                includedSearchChips,
              };
              // console.log(obj)
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
    this.savedSearchViewMore = false;
    setTimeout(() => {
      this.cancelBtnClick.emit(false);
    }, 300);
  }
  onScroll(event: any) {
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
    // console.log(searchBody.savedSearchType);
    // this.dataService.searchOrRecentTapped(true);
    if (searchBody.savedSearchType == "Contact") {
      const contactObj = this.searchContactInput.fromJson(searchBody);
      // if (contactObj.seniority.length > 0) {
      //   const senioirty = contactObj.seniority.map((el) => {
      //     return el;
      //   });
      //   const filteredSeniority =
      //     this.dataService.handleSeniorityById(senioirty);

      //   contactObj.seniority = filteredSeniority;
      // }
      this.dataService.passSearchContactInput(contactObj);
      this.dataService.changeSelectedTab(0);
    } else {
      const companyObj = this.searchCompanyInput.fromJson(searchBody);
      this.dataService.passSearchCompanyInput(companyObj);
      this.dataService.changeSelectedTab(1);
    }
    this.dataService.makeSavesearchVisible(false);
    this.dataService.makeRecentsearchVisible(false);
    this.cancelSaveDiv();
  }
}
