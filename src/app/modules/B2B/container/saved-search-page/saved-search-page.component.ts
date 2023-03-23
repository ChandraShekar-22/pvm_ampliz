import { Component, OnInit } from '@angular/core';
import { B2bService } from '../../services/b2b.service';

@Component({
  selector: 'app-saved-search-page',
  templateUrl: './saved-search-page.component.html',
  styleUrls: ['./saved-search-page.component.css']
})
export class SavedSearchPageComponent implements OnInit {
  offset: any = 0;
  count: any = 7;
  savedSearchViewMore: boolean = false;
  datasource: Array<any> = [];
  isViewmoreButtonVisible: boolean = false;

  constructor(
    private b2bService: B2bService
  ) { }

  ngOnInit() {
    this.getSavedSearchData();
  }
  getSavedSearchData() {
    this.b2bService.getSavedSearch(this.offset, this.count).subscribe(
      (res) => {
        this.datasource = res.savedSearchList;
        this.isViewmoreButtonVisible = this.datasource.length>5;
        this.datasource = this.datasource.slice(0,5);
      },
      (error) => { }
    );
  }
  viewMoreClicked() {
    //  console.log("clicked saved search")
    this.savedSearchViewMore = true
    // console.log(this.savedSearchViewMore )
  }
  cancelBtnClick(value: boolean) {
    this.savedSearchViewMore = value;
  }
}
