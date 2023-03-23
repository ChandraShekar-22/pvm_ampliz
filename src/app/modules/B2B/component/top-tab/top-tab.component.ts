import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
@Component({
  selector: "app-top-tab",
  templateUrl: "./top-tab.component.html",
  styleUrls: ["./top-tab.component.css"],
})
export class TopTabComponent implements OnInit {
  @Input() isPrimary = false;
  @Input() haveCheckbox = false;
  @Input() tabItems = [];
  @Input() allSelected = true;
  @Input() partiallySelected = true;
  @Input() showLoader = false;
  @Input() showHeader = false;
  @Input() selectedFilter: any = {};
  @Input() activeLink = 0;
  @Output() tabChanged = new EventEmitter();
  // New implementation for selection and bulksave
  @Input() haveSelectBox = false;
  @Input() allVisibleSelected = true;
  @Input() allContactsSelected = true;
  @Input() totalItemCount = 0;
  @Input() totalSavableItemCount = 0;
  @Output() selectAllChanged = new EventEmitter();
  @Output() selectVisibleChanged = new EventEmitter();
  @Output() successfullySaved = new EventEmitter();

  @Input() isBorder = false;
  constructor() {}

  changeTab(i: number) {
    this.activeLink = i;
    this.tabChanged.emit(i);
  }
  ngOnInit() {
    // console.log(this.tabItems);
  }

  checkboxValueChange(value) {
    // console.log(this.allSelected);
    this.allSelected = !this.allSelected;
    // if(this.partiallySelected == true) {
    //   this.selectAllChanged.emit(true);
    //   return;
    // }
    this.selectAllChanged.emit(this.allSelected);
  }

  handleSelectVisibleChange() {
    // console.log(this.allVisibleSelected);
    this.allVisibleSelected = !this.allVisibleSelected;
    // if(this.partiallySelected == true) {
    //   this.selectAllChanged.emit(true);
    //   return;
    // }
    this.selectVisibleChanged.emit(this.allVisibleSelected);
  }

  handleSelectAllClick() {
    // this.allContactsSelected = !this.allContactsSelected;ÁÁ
    this.selectAllChanged.emit(this.allContactsSelected);
  }

  handleSuccessSave() {
    this.successfullySaved.emit();
  }
  clearAll() {
    this.allVisibleSelected = false;
    this.partiallySelected = false;
  }
}
