import { Component, OnInit } from '@angular/core';
import * as D3 from 'd3';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
  selector: 'app-apac-location-card',
  templateUrl: './apac-location-card.component.html',
  styleUrls: ['./apac-location-card.component.css']
})
export class ApacLocationCardComponent implements OnInit {
  xAxis = [1, 1000, 1000000];
  countryList: Array<any> = [];
  selectedTab="Contacts";
  constructor(private dataService: DataService, private b2bService:B2bService) { }

  ngOnInit() {
    this.createSvg();
    this.addChart();
    this.getCountryList();
  }


  getCountryList() {
    this.b2bService.getCountryList().subscribe((res) => {
      this.countryList = res.countryList;
    });
  }

  private createSvg(): void {

    var svg = D3.select("svg#apacLocation");
    let width: any = svg.attr("width");
    let height: any = svg.attr("height");

    // Map and projection
    var projection = D3.geoNaturalEarth1()
      .scale(width / 1.6 / Math.PI)
      .translate([width / 2.1, height / 2])

    // Load external data and boot
    D3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( (data: any) => {
      const that=this;
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("fill", "#999")
        .attr("cursor", (d: any, i: any) => {
          if (d.id == 'IND' || d.id == 'MYS' || d.id == 'USA') {
            return "pointer"
          } else {
            return "normal"
          }
        })
        .attr("d", D3.geoPath()
          .projection(projection)
        )
        .style("stroke", "#999")
        .on('click', (event, country: any) => {
          if (country.id == 'IND' || country.id == 'MYS' || country.id == 'USA') {
            let countryName = country.properties.name;
            if(country.id == 'MYS') {
              countryName="Singapore"
            }
            this.makeSearch(event,countryName)
          }
        })
    });
  }

  addChart() {

  }


  makeSearch(event, searchData) {
    // console.log(searchData,this.selectedTab);
    // console.log(searchData,"search data........");
    const countryData = this.countryList.find(item => item.country==searchData);
    event.preventDefault();
    if (this.selectedTab == "Contacts") {
      const bdy: SearchContactInput = new SearchContactInput();
      bdy.countryList = [countryData];
      this.dataService.passSearchContactInput(bdy);
      this.dataService.changeSelectedTab(0);
    } else {
      const bdy: SearchCompanyInput = new SearchCompanyInput();
      bdy.countryList = [countryData];
      this.dataService.passSearchCompanyInput(bdy);
      this.dataService.changeSelectedTab(1);
    }

    this.dataService.makeLandingPageVisible(false);

  }




}
