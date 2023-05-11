import { Component, OnInit } from '@angular/core';
import { Search } from 'angular-feather/icons';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
  selector: 'app-history-search-card',
  templateUrl: './history-search-card.component.html',
  styleUrls: ['./history-search-card.component.css'],
})
export class HistorySearchCardComponent implements OnInit {
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

  constructor(private b2bService: B2bService, private dataService: DataService) {}

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

  nonNullValues(obj, predicate) {
    return Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});
  }
}
