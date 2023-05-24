import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-npi-list",
  templateUrl: "./npi-list.component.html",
  styleUrls: ["./npi-list.component.css"],
})
export class NpiListComponent implements OnInit {
  @Input() heading: string = "";
  @Input() itemData: any = [];
  @Input() keyname: string = "";
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() selectedFilter: string = "";
  @Input() loading: boolean = false;
  constructor() {}

  ngOnInit() {}
  filterChange(e: any) {
    this.onFilterChange.emit(e);
  }
  get noDataDisplay() {
    return this.itemData.length !== 0;
  }
}
