import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { SearchCompanyInput } from '../../models/SearchCompany';
import { SearchContactInput } from '../../models/SearchContactModel';
import { B2bService } from '../../services/b2b.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-recent-search-page',
  templateUrl: './recent-search-page.component.html',
  styleUrls: ['./recent-search-page.component.css']
})
export class RecentSearchPageComponent implements OnInit {
  recentViewMore: boolean = false;
  offset: any = 0;
  count: any = 10;
  recentSearchList: any = [];
  isDataAvailable: boolean = false;
  searchCred: any = {};
  saveSearchListDrawer: boolean = false;
  saveSearchType: string = '';
  isViewmoreButtonVisible: boolean = false;
  constructor(private b2bService: B2bService, private dataService:DataService, private loaderService: LoaderService) {}

  
  ngOnInit() {
    this.getRecentSavedSearch();
  }

  getRecentSavedSearch() {
    this.loaderService.display(true);
    this.b2bService.getRecentSavedSearch(this.offset, this.count).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.recentSearchList = res.searchReportList;
        this.dataService.passRecentSearch(this.recentSearchList);
        this.isViewmoreButtonVisible = this.recentSearchList.length > 5;
        this.recentSearchList = this.recentSearchList.slice(0, 5);
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }


  handleSaveSearchPress(searchData) {
    // console.log(searchData);
    this.saveSearchListDrawer = true;
    this.saveSearchType = searchData.searchType;
    if (this.saveSearchType == 'Contact') {
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
    this.saveSearchListDrawer = false;
    this.dataService.makeSavesearchVisible(true);
  }
  viewMoreClicked() {
    this.recentViewMore = true
  }
  cancelBtnClick(value: boolean) {
    this.recentViewMore = value;
  }
}
