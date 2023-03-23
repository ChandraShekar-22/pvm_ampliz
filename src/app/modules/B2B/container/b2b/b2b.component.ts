import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { DataService } from "../../services/data.service";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-b2b",
  templateUrl: "./b2b.component.html",
  styleUrls: ["./b2b.component.css"],
})
export class B2bComponent implements OnInit, OnDestroy {
  resentSearchButton: boolean = false;
  savedSearchButton: boolean = false;
  currentTab: number = 0;
  subscription: Subscription;
  tabSubscription: Subscription;
  firstTimeSubscribtion: Subscription;
  isFirstTime: boolean = false;

  tabItems = [
    { name: "People", icon: { name: "Users", type: "feather" } },
    { name: "Company", icon: { name: "business", type: "mat" } },
  ];
  constructor(
    private dataService: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.subscription = this.dataService.searchVisibility.subscribe(
      (visible) => {
        this.savedSearchButton = visible.saveSearchVisible;
        this.resentSearchButton = visible.recentSearchVisible;
      }
    );
    this.tabSubscription = this.dataService.mainTab.subscribe((tab) => {
      this.currentTab = tab;
    });
    this.dataService.changeLoadStatus(true);
    this.firstTimeSubscribtion = this.dataService.firstLoad.subscribe(
      (data) => {
        this.isFirstTime = data;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tabSubscription.unsubscribe();
  }
  handleTabChange(i) {
    this.currentTab = i;
  }
  reacentButtonClick() {
    this.resentSearchButton = !this.resentSearchButton;
    this.savedSearchButton = false;
  }
  savedButtonClick() {
    this.savedSearchButton = !this.savedSearchButton;
    this.resentSearchButton = false;
  }
  // Search employee in people tab from company tab
  searchEmployeesByCompany() {
    this.handleTabChange(1);
    this.dataService.changeSelectedTab(0);
  }
}
