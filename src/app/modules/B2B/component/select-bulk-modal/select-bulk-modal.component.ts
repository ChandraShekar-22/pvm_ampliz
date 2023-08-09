import { ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { UntypedFormControl, FormGroup, Validators } from "@angular/forms";
// import { MatAutocompleteSelectedEvent, MatDialog, MatMenuTrigger } from '@angular/material';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { CommonFunctionsService } from "src/app/modules/basic/common/common-functions.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { B2bService } from "../../services/b2b.service";
import { DataService } from "../../services/data.service";
import { MessageService } from "../../services/message.service";

@Component({
	selector: 'app-select-bulk-modal',
	templateUrl: './select-bulk-modal.component.html',
	styleUrls: ['./select-bulk-modal.component.css']
})
export class SelectBulkModalComponent implements OnInit {
	numberOfContacts: number = 0;
	@Output() selectVisibleClicked = new EventEmitter();
	@Output() selectAllClicked = new EventEmitter();
	@Output() successfullySaved = new EventEmitter();
	@Input() allContactsSelected: boolean = false;
	@Input() allVisibleSelected: boolean = false;
	@Input() totalSavableItemCount: number = 0;
	@Input() totalItemCount: number = 0;
	@Input() selectedFilter: any = {};
	@Input() b2b?: boolean = false;
	@Input() partiallySelected: boolean = false;
	@ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
	@ViewChild('autoInput') autoInput: ElementRef;
	@ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;

	myControl = new UntypedFormControl();
	numberOfPeopleForm = new UntypedFormControl();
	apacList: Array<any> = [];
	filteredApacList: Array<any> = [];
	separatorKeysCodes: number[] = [ENTER];
	listName: string = '';
	showInputError: boolean = false;
	showListError: boolean = false;
	isSubscribed: boolean = false;
	triggerSelectMax: boolean = false;

	constructor(
		private dataService: DataService,
		private b2bService: B2bService,
		private messageService: MessageService,
		private commonService: CommonFunctionsService,
		private dialog: MatDialog,
		private loaderService: LoaderService
	) {}

	ngOnInit() {
		// var checkbox = document.getElementById("check-box") as HTMLInputElement;
		// if (this.allContactsSelected === false) {
		//   console.log("IN ngonnit");
		//   checkbox.indeterminate = true;
		// }
		this.dataService.apacListSubscriber.subscribe((data) => {
			this.apacList = data;
		});
		this.addFormControl();
		this.isSubscribed = localStorage.getItem('SubscriptionisActive') == 'true';
	}
	addFormControl() {
		this.myControl.valueChanges.subscribe((value: any) => {
			// console.log(value, "Value is");
			this.listName = value;
			if (value == '') {
				this.filteredApacList = this.apacList;
			} else {
				this.filteredApacList = this.apacList.filter((item) => {
					return item.listName.toLowerCase().includes(value.toLowerCase());
				});
			}
		});
	}

	get isCheckboxSelected() {
		if (this.allVisibleSelected || this.partiallySelected) {
			return true;
		}
	}

	handleSelectVisible() {
		if (this.isSubscribed == true) {
			this.menuTrigger.closeMenu();
			this.selectVisibleClicked.emit();
		}
	}
	handleSelectAll() {
		if (this.isSubscribed == true) {
			this.triggerSelectMax = true;
			this.numberOfPeopleForm.disable();
			// this.menuTrigger.closeMenu();
			this.numberOfContacts = this.totalSavableItemCount;
			this.selectAllClicked.emit();
		}
	}
	deselectMax() {
		this.triggerSelectMax = false;
		this.numberOfPeopleForm.setValue(0);
		this.numberOfPeopleForm.enable();
	}

	selectList(event) {
		// console.log(event, "Value Chip");
		this.listName = event.value;
		// this.filteredApacList = [];
	}

	selectListFromAuto(list: MatAutocompleteSelectedEvent) {
		this.listName = list.option.value;
		this.autoInput.nativeElement.value = list.option.value;
	}

	selectListFromSelect(event) {
		this.listName = event;
	}

	handleSaveContactsBulk() {
		if (this.isSubscribed == true) {
			// console.log(this.listName);
			if (this.numberOfContacts <= 0) {
				this.showInputError = true;
			}
			const list = this.apacList.filter((itm) => itm.listName == this.listName);
			// console.log(list);
			if (list[0]) {
				this.saveContactsToList(list[0].listId);
			} else {
				this.createApacList();
			}
		}
	}
	createApacList() {
		if (this.listName !== '') {
			const body = {
				listName: this.listName,
				autoCreated: false,
				listType: 'B2B'
			};
			this.b2bService.createB2bList(body).subscribe(
				(res) => {
					this.getApacList();
					this.saveContactsToList(res.b2bApacListId);
					this.messageService.display(true, 'Successfully created the list', 'Saved Successfully');
				},
				(error) => {
					this.commonService.displayError(error);
				}
			);
		} else {
			this.showListError = true;
		}
	}

	saveContactsToList(listId) {
		if (this.isSubscribed == true) {
			this.loaderService.display(true);
			const body = {
				listId: listId,
				recordCount: this.numberOfContacts,
				searchInputContact: this.selectedFilter
			};
			this.b2bService.savePeopleAsPerCount(body).subscribe(
				(res) => {
					setTimeout(() => {
						this.menuTrigger.closeMenu();
						this.successfullySaved.emit();
						this.messageService.display(true, `Successfully saved ${this.numberOfContacts} contacts `);
						this.loaderService.display(false);
					}, 3000);
				},
				(error) => {
					this.loaderService.display(false);
					this.menuTrigger.closeMenu();
					this.commonService.displayError(error);
				}
			);
		}
	}

	getApacList() {
		this.b2bService.getB2bApacList(0, 1000).subscribe((res) => {
			this.dataService.changeApacList(res.savedlistInfoList);
		});
	}
	handleTrigerClick() {
		this.numberOfContacts = 0;
		this.showInputError = false;
		this.showListError = false;
		this.listName = '';
		this.myControl.setValue('', { emitEvent: true });
		this.menuTrigger.openMenu();
	}

	handleInputFocus() {
		this.filteredApacList = [...this.apacList];
	}

	handleInputBlur() {
		setTimeout(() => {
			this.filteredApacList = [];
		}, 300);
	}
	handleContactFocus(event) {
		this.numberOfContacts = this.numberOfContacts != 0 ? this.numberOfContacts : null;
	}
	handleContactBlur(event) {
		this.numberOfContacts = this.numberOfContacts != null ? this.numberOfContacts : 0;
	}

	openTalkToSales() {
		if (this.isSubscribed == true) {
			this.dialog.open(this.myDialog);
		}
	}
	closeTalkToSales() {
		this.dialog.closeAll();
	}

	exportBulkToCsv() {
		let body: any = {
			count: this.numberOfContacts,
			searchInputContact: this.selectedFilter
		};
		this.loaderService.display(true);
		this.b2bService.exportBulkToCsv(body).subscribe(
			(res) => {
				this.loaderService.display(false);
				this.menuTrigger.closeMenu();
				this.successfullySaved.emit();
				const name = 'contacts' + new Date().toISOString() + '.csv';
				this.b2bService.saveFile(res.body, name);
			},
			(err) => {
				this.loaderService.display(false);
			}
		);
	}
}
