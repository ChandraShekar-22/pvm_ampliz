import { Component, OnInit } from '@angular/core';
import { Search } from 'angular-feather/icons';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { Router } from '@angular/router';
@Component({
  selector: 'app-history-search-card',
  templateUrl: './history-search-card.component.html',
  styleUrls: ['./history-search-card.component.css'],
})
export class HistorySearchCardComponent implements OnInit {
  searchContactInput: SearchContactInput = new SearchContactInput();
  searchCompanyInput: SearchCompanyInput = new SearchCompanyInput();

  activeTab: number = 0;
  tabs = [
    {
      title: 'Recent Search',
      content: [],
    },
    {
      title: 'Saved search',
      content: [],
    },
  ];
  loader: boolean = true;

  recentList: any = [];
  savedList: any = [];

  itemToRemove: any = ['savedDateTime', 'savedSearchId', 'savedSearchType', 'searchName', 'searchType'];

  constructor(private b2bService: B2bService, private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.setActive(0);
  }

  setActive(tab: number) {
    this.activeTab = tab;
    this.loader = true;
    if (tab == 0) {
      this.getRecentSearch();
    } else {
      this.getSavedSearch();
    }
  }

  getRecentSearch() {
    this.b2bService.getRecentSavedSearch(0, 5).subscribe((res) => {
      this.recentList = res.searchReportList;
      this.tabs[0].content = [];
      res.searchReportList.map((item) => {
        if (item.searchType === 'Contact') {
          // const _time = this.getTimeDifference(item.searchAt);
          const _time = this.dataService.getTimeDifference(item.searchAt);
          const _notEmpty = this.nonNullValues(item.contactSearchParams, (val) =>
            typeof val == 'object' ? val.length > 0 : val !== ''
          );
          const _result = Object.values(_notEmpty).toString().split(',').join(', ');
          this.storeContent(_time, _result);
        } else {
          const _time = this.dataService.getTimeDifference(item.searchAt);
          const _notEmpty = this.nonNullValues(item.companySearchParams, (val) =>
            typeof val == 'object' ? val.length > 0 : val !== ''
          );
          const _result = Object.values(_notEmpty).toString().split(',').join(', ');
          this.storeContent(_time, _result);
        }
      });
    });
  }

  getSavedSearch() {
    this.b2bService.getSavedSearch(0, 5).subscribe((res) => {
      this.savedList = res.savedSearchList;
      this.tabs[1].content = [];
      res.savedSearchList.map((search) => {
        const _time = this.dataService.getTimeDifference(search.savedDateTime);
        const _result = search.searchName;
        this.storeContent(_time, _result, true);
      });
    });
  }

  storeContent(_time, _result, savedSearch?) {
    if (savedSearch) {
      const obj = {
        time: _time,
        search: _result,
      };
      this.tabs[1].content.push(obj);
    } else {
      const obj = {
        time: _time,
        search: _result,
      };
      this.tabs[0].content.push(obj);
    }
    this.loader = false;
  }

  search(index: number, isRecent: boolean) {
    if (isRecent) {
      this.searchRecent(index);
    } else {
      this.searchSaved(index);
    }
  }

  searchRecent(index: any) {
    const item = this.recentList[index];
    if (item.searchType == 'Contact') {
      const contactObj = this.searchContactInput.fromJson(item.contactSearchParams);
      this.dataService.passSearchContactInput(contactObj);
      this.dataService.changeSelectedTab(0);
    } else {
      const companyObj = this.searchCompanyInput.fromJson(item.companySearchParams);
      this.dataService.passSearchCompanyInput(companyObj);
      this.dataService.changeSelectedTab(1);
    }
    this.router.navigate(['/b2b']);
    this.dataService.makeSavesearchVisible(false);
    this.dataService.makeRecentsearchVisible(false);
  }

  searchSaved(index: any) {
    const res: any = this.nonNullValues(this.savedList[index], (val) =>
      typeof val == 'object' ? val.length > 0 : val !== ''
    );
    if (res.country && res.countryList.length > 0) {
      const sorted = this.handleCountry(res.countryList);
      res.countryList = sorted;
    }
    if (res.stateList && res.stateList.length > 0) {
      const sorted = this.handleState(res.stateList);
      res.stateList = sorted;
    }
    if (res.cityList && res.cityList.length > 0) {
      const sorted = this.handleCity(res.cityList);
      res.cityList = sorted;
    }
    const sorted = this.sortSavedList(res);
    if (res.savedSearchType == 'Contact') {
      const contactObj: any = this.searchContactInput.fromJson(sorted);
      this.dataService.passSearchContactInput(contactObj);
      this.dataService.changeSelectedTab(0);
    } else {
      const companyObj: any = this.searchCompanyInput.fromJson(sorted);
      this.dataService.passSearchCompanyInput(companyObj);
      this.dataService.changeSelectedTab(1);
    }
    this.router.navigate(['/b2b']);
  }

  handleCountry(item: any) {
    const tempArr = [];
    item.map((country) => {
      tempArr.push(country.country);
    });
    return tempArr;
  }
  handleState(item: any) {
    const tempArr = [];
    item.map((state) => {
      tempArr.push(state.stateFullName);
    });
    return tempArr;
  }
  handleCity(item: any) {
    const tempArr = [];
    item.map((city) => {
      tempArr.push(city.city);
    });
    return tempArr;
  }
  sortSavedList(list: any) {
    this.itemToRemove.map((item) => {
      delete list[item];
    });
    const arr = list;
    return arr;
  }

  nonNullValues(obj, predicate) {
    return Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});
  }
}
