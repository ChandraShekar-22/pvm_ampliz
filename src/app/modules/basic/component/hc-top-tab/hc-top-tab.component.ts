import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";

@Component({
	selector: 'app-hc-top-tab',
	templateUrl: './hc-top-tab.component.html',
	styleUrls: ['./hc-top-tab.component.css']
})
export class HcTopTabComponent implements OnInit, OnChanges {
	@Input() isPrimary = false;
	@Input() haveCheckbox = false;
	@Input() tabItems = [];
	@Input() allSelected = false;
	@Input() partiallySelected = true;
	@Input() showLoader = false;
	@Input() selectedFilter: any = {};
	@Input()
	activeLink = 0;

	@Input() fontSize: any = '15px';
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

	@Input() isBorder = true;
	constructor() {}

	changeTab(i: number) {
		this.activeLink = i;
		this.tabChanged.emit(i);
	}
	ngOnInit() {}
	ngOnChanges(changes: SimpleChanges): void {
		if (!changes.allSelected && changes.partiallySelected && changes.partiallySelected.currentValue == false) {
			this.allSelected = false;
		}
	}

	checkboxValueChange() {
		if (this.partiallySelected == true) {
			this.allSelected = false;
			this.selectAllChanged.emit(false);
			return;
		}
		this.selectAllChanged.emit(this.allSelected);
	}

	handleSelectVisibleChange() {
		this.allVisibleSelected = !this.allVisibleSelected;
		// if(this.partiallySelected == true) {
		//   this.selectAllChanged.emit(true);
		//   return;
		// }
		this.selectVisibleChanged.emit(this.allVisibleSelected);
	}

	handleSelectAllClick() {
		this.allContactsSelected = !this.allContactsSelected;
		this.selectAllChanged.emit(this.allContactsSelected);
	}

	handleSuccessSave() {
		this.successfullySaved.emit();
	}
}
