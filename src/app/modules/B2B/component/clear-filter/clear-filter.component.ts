import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-clear-filter",
  templateUrl: "./clear-filter.component.html",
  styleUrls: ["./clear-filter.component.css"],
})
export class ClearFilterComponent implements OnInit {
  @Input() activeFilterCount: any;
  @Output()
  clearAllFilters: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  clearAll() {
    this.clearAllFilters.emit();
  }

  ngOnInit(): void {}
}
