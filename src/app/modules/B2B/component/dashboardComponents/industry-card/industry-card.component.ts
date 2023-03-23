import { Component, OnInit } from '@angular/core';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
  selector: 'app-industry-card',
  templateUrl: './industry-card.component.html',
  styleUrls: ['./industry-card.component.css']
})
export class IndustryCardComponent implements OnInit {
  selectedTab: string = "Contacts";
  listItems: Array<any> = [
    {
      name:"Manufacturing",
      count:"150k"
    },
    {
      name:"Bussiness Services",
      count:"163k"
    },
    {
      name:"Education",
      count:"100k"
    },
    {
      name:"Retail",
      count:"928k"
    },
    {
      name:"Health Care",
      count:"650k"
    },
    {
      name:"Engineering&Technical",
      count:"150k"
    },
    {
      name:"Engineering&Technical",
      count:"150k"
    }
  ]

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  
  makeSearch(event, searchData) {
    // console.log(searchData,this.selectedTab);
    event.preventDefault();
    if (this.selectedTab == "Contacts") {
      const bdy: SearchContactInput = new SearchContactInput();
      bdy.industryInclude = [searchData.name];
      this.dataService.passSearchContactInput(bdy);
      this.dataService.changeSelectedTab(0);
    } else {
      const bdy: SearchCompanyInput = new SearchCompanyInput();
      bdy.industryInclude = [searchData.name];
      this.dataService.passSearchCompanyInput(bdy);
      this.dataService.changeSelectedTab(1);
    }
    
    this.dataService.makeLandingPageVisible(false);

  }


}
