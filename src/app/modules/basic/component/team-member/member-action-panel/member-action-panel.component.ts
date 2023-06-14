import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-action-panel',
  templateUrl: './member-action-panel.component.html',
  styleUrls: ['./member-action-panel.component.css'],
})
export class MemberActionPanelComponent implements OnInit {
  tabItems: any = [
    {
      name: 'credits',
      active: true,
    },
    {
      name: 'activity',
      active: false,
    },
    {
      name: 'lists',
      active: false,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  changeTab(requestedIndex: any) {
    this.tabItems.map((tab) => {
      tab.active = false;
    });
    this.tabItems[requestedIndex].active = true;
  }
}
