import { Component, OnInit } from '@angular/core';
import * as D3 from 'd3';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
  selector: 'app-employee-list-card',
  templateUrl: './employee-list-card.component.html',
  styleUrls: ['./employee-list-card.component.css']
})
export class EmployeeListCardComponent implements OnInit {

 data = [
    { "Key": "10,000+", "Value": 1000000, "color": "#f9f9f9" },
    { "Key": "1,000 - 10,000", "Value": 970000,  "color": "#eaf4ff" },
    { "Key": "500 - 1000", "Value": 100000, "color": "#deedff" },
    { "Key": "100 - 500", "Value": 1000000, "color": "#cce4ff" },
    { "Key": "50 - 100", "Value": 140000,  "color": "#a3cdff" },
    { "Key": "10 - 50", "Value": 900000, "color": "#8eb9e9" },
  ];
  svg;
  // private margin = 30;
   width = 250;
   height = 230;
  // The radius of the pie chart is half the smallest side
  // private radius = Math.min(this.width, this.height) / 2 - this.margin.right;
   colors;
   margin = {top: 20, right: 30, bottom: 30, left: 100};
  xAxis = [1, 1000, 1000000];
  selectedTab="Contacts";
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.createSvg();
    this.addChart();
  }

  public createSvg(): void {
    this.svg = D3.select("figure#employeeBar")
    .append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  addChart() {
    var x = D3.scaleLinear()
    .range([0, this.width])
    .domain([0, 1000000])
    
    

    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(D3.axisBottom(x).ticks(3))
    .selectAll("text")
      .attr("transform", "translate(-10,0)")
      .style("text-anchor", "end");

      var y = D3.scaleBand()
    .range([ 0, this.height ])
    .domain(this.data.map(function(d) { return d.Key; }))
    .padding(.1);
  this.svg.append("g")
    .call(D3.axisLeft(y))

  //Bars
  this.svg.selectAll("myRect")
    .data(this.data)
    .enter()
    .append("rect")
    .attr("x", x(1000) )
    .attr("y", function(d,i) { return y(d.Key); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", 25 )
    .attr("fill", "#f2f2f2")
    .on("click", (event, data) => {
      this.makeSearch(event,data.Key)
    });
  }

  
  makeSearch(event, searchData) {
    // console.log(searchData,this.selectedTab);
    event.preventDefault();
    if (this.selectedTab == 'Contacts') {
      const bdy: SearchContactInput = new SearchContactInput();
      // bdy.employeeRangeList = [searchData];
      this.dataService.passSearchContactInput(bdy);
      this.dataService.changeSelectedTab(0);
    } else {
      const bdy: SearchCompanyInput = new SearchCompanyInput();
      // bdy.employeeRangeList = [searchData];
      this.dataService.passSearchCompanyInput(bdy);
      this.dataService.changeSelectedTab(1);
    }
    
    this.dataService.makeLandingPageVisible(false);

  }


}
