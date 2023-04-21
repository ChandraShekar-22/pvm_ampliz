import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SearchContactInput } from '../../models/SearchContactModel';
@Component({
  selector: 'app-no-filter',
  templateUrl: './no-filter.component.html',
  styleUrls: ['./no-filter.component.css'],
})
export class NoFilterComponent implements OnInit {
  constructor(public dataService: DataService) {}
  recentSearch: any = this.dataService.recentSearchData.value.slice(0, 5);
  recentData: any = [];
  searchContactInput: SearchContactInput = new SearchContactInput();
  Object = Object;

  ngOnInit(): void {
    this.recentSearch.map((item) => {
      if (item.searchType === 'Contact') {
        const obj = this.nonNullValues(item.contactSearchParams, (val) =>
          typeof val == 'object' ? val.length > 0 : val !== ''
        );
        this.recentData.push(obj);
      }
      // this.recentData.map((data, index) => {
      //   data['newKey'] = data['oldKey'];
      //   delete data['oldKey'];
      //   // let val: any = Object.key(data);
      //   // data = val.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      // });
    });
  }

  searchRecent(index: any) {
    if (this.recentSearch[index].searchType === 'Contact') {
      this.dataService.passSearchContactInput(this.recentSearch[index].contactSearchParams);
    }
  }

  nonNullValues(obj, predicate) {
    return Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});
  }
}
