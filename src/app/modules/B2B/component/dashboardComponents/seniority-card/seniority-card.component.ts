import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as D3 from 'd3';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { DataService } from 'src/app/modules/B2B/services/data.service';
@Component({
  selector: "app-seniority-card",
  templateUrl: "./seniority-card.component.html",
  styleUrls: ["./seniority-card.component.css"],
})
export class SeniorityCardComponent implements OnInit, AfterViewInit {
  public data = [
    { Seniority: "Bord-Members", Value: "2", color: "#f9f9f9" },
    { Seniority: "C-Level", Value: "4", color: "#eaf4ff" },
    { Seniority: "VP-Level", Value: "4", color: "#deedff" },
    { Seniority: "Director", Value: "10", color: "#cce4ff" },
    { Seniority: "Manager", Value: "20", color: "#a3cdff" },
    { Seniority: "Non-Manager", Value: "60", color: "#8eb9e9" },
  ];
  public svg;
  public margin = 30;
  public width = 250;
  private height = 250;
  // The radius of the pie chart is half the smallest side
  public radius = Math.min(this.width, this.height) / 2 - this.margin;
  public colors;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  public createSvg(): void {
    this.svg = D3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private createColors(): void {
    // console.log(this.data.map(d => d.color))
    this.colors = D3.scaleOrdinal()
      .domain(this.data.map((d) => d.Seniority))
      .range(this.data.map((d) => d.color));
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = D3.pie<any>().value((d: any) => Number(d.Value));
    // Build the pie chart
    this.svg
      .selectAll("pieces")
      .data(pie(this.data))
      .enter()
      .append("path")
      .attr("d", D3.arc().innerRadius(50).outerRadius(this.radius))
      .attr("fill", (d, i) => this.colors(i))
      .attr("stroke", "#fff")
      .style("stroke-width", "1px")
      .on("click", (event, data) => {
        this.makeSearch(event, data.data.Seniority);
      });
  }
  ngAfterViewInit() {}

  makeSearch(event, data) {
    event.preventDefault();
    let searchCred: SearchContactInput = new SearchContactInput();
    searchCred.seniority = [data];
    this.dataService.passSearchContactInput(searchCred);
    this.dataService.changeSelectedTab(0);
    this.dataService.makeLandingPageVisible(false);
  }
}
