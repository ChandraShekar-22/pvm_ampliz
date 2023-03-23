import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';


@Component({
  selector: 'app-recent-search-card',
  templateUrl: './recent-search-card.component.html',
  styleUrls: ['./recent-search-card.component.css']
})
export class RecentSearchCardComponent implements OnInit {
@Input() searchData: any;
  searchName: string = "";
  showInput: boolean = false;
  searchContactInput: SearchContactInput = new SearchContactInput();
  searchCompanyInput: SearchCompanyInput = new SearchCompanyInput();
  @Output() saveSearchPressed = new EventEmitter();
  @ViewChild('name') searchElement: ElementRef;
  constructor(
    private b2bService:B2bService,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  makeSearch() {
    // console.log(this.searchData.savedSearchType);
    // this.dataService.searchOrRecentTapped(true);
    if (this.searchData.searchType == "Contact") {
      const contactObj = this.searchContactInput.fromJson(this.searchData.contactSearchParams);
      this.dataService.passSearchContactInput(contactObj);
      this.dataService.changeSelectedTab(0);
    } else {
      const companyObj = this.searchCompanyInput.fromJson(this.searchData.companySearchParams);
      this.dataService.passSearchCompanyInput(companyObj);
      this.dataService.changeSelectedTab(1);
    }
    this.dataService.makeSavesearchVisible(false);
    this.dataService.makeRecentsearchVisible(false);
  }

  handleSave() {
    this.saveSearchPressed.emit(this.searchData);
  }
}
