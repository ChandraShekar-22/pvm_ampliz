import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { FilterStorageService } from 'src/app/modules/B2B/services/filter-storage.service';

@Component({
	selector: 'app-individual-filter',
	templateUrl: './individual-filter.component.html',
	styleUrls: ['./individual-filter.component.css']
})
export class IndividualFilterComponent implements OnInit, OnChanges {
	@Input() filterType: string = 'Imaging';
	@Input() totalItems: Array<any> = [];
	@Input() labelKey: string = '';
	@Input() valueKey: string = '';
	@Input() includedItems: any = [];
	@Input() excludedItems: Array<any> = [];
	@Input() recentIncludeItems: Array<any> = [];
	@Input() recentExcludeItems: Array<any> = [];
	@Input() includePlaceholder: string = 'Include';
	@Input() excludePlaceholder: string;
	@Input() title: string = 'Title';
	@Input() hasLogo: boolean = false;
	@Input() type: string = 'autocomplete';
	@Input() disabled: boolean = false;
	@Input() defaultValue: any = 0;

	@Output() valueChanges = new EventEmitter();
	@Output() removePressed = new EventEmitter();
	@Output() clearPressed = new EventEmitter();
	@Output() excludeClearPressed = new EventEmitter();
	@Output() valueSelected = new EventEmitter();
	@Output() includedItemsChange = new EventEmitter();
	@Output() excludedItemsChange = new EventEmitter();
	listApi: any;
	separatorKeysCodes: number[] = [ENTER, COMMA];

	totalItemsIncludeControl = new UntypedFormControl();
	totalItemsExcludeControl = new UntypedFormControl();
	selectable: boolean = true;

	@ViewChild('includeItemInput')
	includeItemInput: ElementRef<HTMLInputElement>;
	@ViewChild('excludeItemInput')
	excludeItemInput: ElementRef<HTMLInputElement>;
	constructor(private filterStorageService: FilterStorageService) {}

	ngOnInit() {
		this.handleForms();
		this.getRecentValues();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (
			this.filterType != 'singleselectnumber' &&
			changes.includedItems &&
			changes.includedItems.firstChange == false &&
			changes.includedItems.currentValue.length > 0
		) {
			this.setLocalStorageValues(changes.includedItems.currentValue[0], 'include');
		}
	}
	public reset() {
		this.includeItemInput.nativeElement.value = '';
		this.totalItemsIncludeControl.setValue('', { emitEvent: true });
		if (this.excludeItemInput) {
			this.excludeItemInput.nativeElement.value = '';
			this.totalItemsExcludeControl.setValue('', { emitEvent: true });
		}
	}

	handleForms() {
		this.totalItemsIncludeControl.valueChanges.subscribe((value: string) => {
			this.valueChanges.emit(value);
		});
		this.totalItemsExcludeControl.valueChanges.subscribe((value: string) => {
			this.valueChanges.emit(value);
			alert(JSON.stringify(value));
		});
	}

	removeItem(content, type = 'include') {
		if (type == 'include') {
			const index = this.includedItems.indexOf(content);
			this.includedItems.splice(index, 1);
			this.includedItemsChange.emit(this.includedItems);
		} else {
			const index = this.excludedItems.indexOf(content);
			this.excludedItems.splice(index, 1);
			this.excludedItemsChange.emit(this.excludedItems);
		}
		this.totalItems = [];
		// this.removePressed.emit({ content, type });
	}

	selectedItem(event, type = 'include') {
		const value = this.labelKey == '' ? event.option.value : event.option.value[this.labelKey];
		this.reset();
		if (type == 'include') {
			const found = this.includedItems.indexOf(value);
			if (found == -1) {
				this.includedItems.push(value);
				this.includedItemsChange.emit(this.includedItems);
				this.setLocalStorageValues(event.option.value, 'include');
			}
		} else {
			const found = this.excludedItems.indexOf(value);
			if (found == -1) {
				this.excludedItems.push(value);
				this.excludedItemsChange.emit(this.excludedItems);
				this.setLocalStorageValues(event.option.value, 'exclude');
			}
		}
		if (this.type == 'autocomplete') {
			this.totalItems = [];
		}
		// this.valueSelected.emit({ value: event.option.value, type });
	}

	clearItems(type = 'include') {
		if (this.type == 'autocomplete') {
			this.totalItems = [];
		}
		if (type == 'include') {
			this.includedItems = [];
			this.includedItemsChange.emit(this.includedItems);
		} else {
			this.excludedItems = [];
			this.excludedItemsChange.emit(this.excludedItems);
		}
	}

	// multi select operations
	multiSelectChange(event) {
		this.includedItemsChange.emit(event.value);
	}

	singleSelectChange() {
		this.includedItemsChange.emit(this.includedItems);
	}
	removeIncludedMultiSelect(content) {
		this.includedItems = this.includedItems.filter((item) => {
			return item !== content;
		});
		this.includedItemsChange.emit(this.includedItems);
	}

	// text operations
	selectText(item, selectionType = 'auto') {
		let val = '';
		if (selectionType == 'auto') {
			val = item.value;
		} else {
			val = item.option.value;
		}
		const found = this.includedItems.indexOf(val);
		if (found == -1) {
			this.includedItems.push(val);
			this.includedItemsChange.emit(this.includedItems);
			this.setLocalStorageValues(val, 'include');
		}
		this.reset();
	}

	async setLocalStorageValues(value, type = 'include') {
		const recentKey = `recent${this.filterType}_${type}${this.title.trim()}`;
		const data: Array<any> = (await this.filterStorageService.get(recentKey)) || [];
		let valueIndex = 0;
		if (typeof value == 'object') {
			//At some cases we are adding the values as object.So we are taking the first key of the object
			const firstKey = Object.keys(value)[0];
			valueIndex = data.findIndex((itm) => itm[firstKey] == value[firstKey]);
		} else {
			valueIndex = data.indexOf(value);
		}
		if (valueIndex === -1) {
			await this.filterStorageService.set(recentKey, [...data.splice(-2), value]);
			this.getRecentValues();
		}
	}

	getRecentValues() {
		const includeRecentKey = `recent${this.filterType}_${'include'}${this.title.trim()}`;
		const excludeRecentKey = `recent${this.filterType}_${'exclude'}${this.title.trim()}`;
		this.recentIncludeItems = this.filterStorageService.get(includeRecentKey) || [];
		this.recentExcludeItems = this.filterStorageService.get(excludeRecentKey) || [];
	}
}
