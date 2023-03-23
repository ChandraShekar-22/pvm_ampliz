import { Component, OnInit } from '@angular/core';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
  selector: 'app-department-card',
  templateUrl: './department-card.component.html',
  styleUrls: ['./department-card.component.css']
})
export class DepartmentCardComponent implements OnInit {

  listItems: Array<any> = [
    {
      name: "Engineering & Technical",
      count: "150k",
      value: "Engineering & Technical",
    },
    {
      name: "Operations",
      count: "163k",
      value: "Operations",
    },
    {
      name: "Finance",
      count: "100k",
      value: "Finance",
    },
    {
      name: "Sales",
      count: "928k",
      value: "Sales",
    },
    {
      name: "Medical & Health",
      count: "650k",
      value: "Medical",
    }
  ]

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  makeSearch(event, data) {
    event.preventDefault();
    let searchCred: SearchContactInput = new SearchContactInput();
    searchCred.deptInclude = [data];
    
    this.dataService.passSearchContactInput(searchCred);
    // this.dataService.searchOrRecentTapped(true);
    this.dataService.changeSelectedTab(0);
    this.dataService.makeLandingPageVisible(false);
  }

}
