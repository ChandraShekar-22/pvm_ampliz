import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ImagingDataService } from "src/app/modules/ImagingCenter/services/imaging-data.service";
import { DataService } from "../../service/data.service";

@Component({
  selector: "app-payor",
  templateUrl: "./payor.component.html",
  styleUrls: ["./payor.component.css"],
})
export class PayorComponent implements OnInit {
  tabItems = [
    { name: `Executive`, icon: { name: "" } },
    { name: `Companies`, icon: { name: "" } },
  ];

  currentTab: number = 1;
  tabSubscription: Subscription;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.tabSubscription = this.dataService.mainSelectedTab.subscribe((tab) => {
      this.currentTab = tab;
    });
  }
  handleTabChange(event) {
    this.currentTab = event;
  }
}
