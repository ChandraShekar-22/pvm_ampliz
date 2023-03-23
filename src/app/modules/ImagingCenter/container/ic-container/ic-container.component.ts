import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImagingDataService } from '../../services/imaging-data.service';

@Component({
  selector: 'app-ic-container',
  templateUrl: './ic-container.component.html',
  styleUrls: ['./ic-container.component.css']
})
export class IcContainerComponent implements OnInit {
  tabItems = [
    { name: `Executive`, icon: { name: "" } },
    { name: `Imaging Center`, icon: { name: "" } },
  ];

  currentTab: number = 1;
  tabSubscription: Subscription;
  constructor(private dataService: ImagingDataService) { }

  ngOnInit() {
    this.tabSubscription = this.dataService.mainSelectedTab.subscribe((tab) => {
      this.currentTab = tab;
    });
  }
  handleTabChange(event) {
    this.currentTab = event;
  }

}
