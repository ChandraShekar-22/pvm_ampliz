import { OnInit, ViewEncapsulation } from "@angular/core";
import { Component } from "@angular/core";

import { IDropdownSettings } from "ng-multiselect-dropdown";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ElementRef, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface Vegetable {
  name: string;
}
export interface Country {
  name: string;
}
@Component({
  selector: "app-physician-filter",
  templateUrl: "./physician-filter.component.html",
  styleUrls: ["./physician-filter.component.css"],
})
export class PhysicianFilterComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  div1: boolean = false;
  title_filter: boolean = false;
  first_label: boolean = false;
  levelSelection: boolean = false;
  DepartmentSelection: boolean = false;
  locationSelection: boolean = false;
  title_label: boolean = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  toppingsControl = new UntypedFormControl([]);
  departmentControl = new UntypedFormControl([]);
  toppingList: string[] = ["c-level", "director", "manager", "staff", "vp"];
  departmentList: string[] = ["emergency", "nuero", "skin"];
  countriesCtrl = new UntypedFormControl();
  filteredCountries: Observable<string[]>;
  countries: string[] = ["India"];
  allCountries: string[] = [
    "India",
    "USA",
    "UK",
    "Australia",
    "Belgium",
    "New Zealand",
    "Canada",
    "Philippines",
    "Russia",
  ];
  status: boolean = false;
  titleClicked: boolean = false;
  personName = "PersonName";
  changedName = "";
  test(event) {
    this.changedName = event;
  }
  changedTitle = "";
  titleChanged(event) {
    this.changedTitle = event;
  }
  onToppingRemoved(topping: string) {
    const toppings = this.toppingsControl.value as string[];
    this.removeFirst(toppings, topping);
    this.toppingsControl.setValue(toppings); // To trigger change detection
  }
  onDepartmentRemoved(topping: string) {
    const toppings = this.departmentControl.value as string[];
    this.removeFirst(toppings, topping);
    this.departmentControl.setValue(toppings); // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  constructor() {
    this.filteredCountries = this.countriesCtrl.valueChanges.pipe(
      startWith(null),
      map((country: string | null) =>
        country ? this._filter(country) : this.allCountries.slice()
      )
    );
  }
  ngOnInit() {
    this.first_label = true;
    this.title_label = true;
    this.dropdownList = [
      { item_id: 1, item_text: "item 1" },
      { item_id: 2, item_text: "item2" },
      { item_id: 3, item_text: "item3" },
      { item_id: 4, item_text: "item4" },
      { item_id: 5, item_text: "item5" },
    ];
    this.selectedItems = [
      { item_id: 3, item_text: "item2" },
      { item_id: 4, item_text: "item3" },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: false,
      enableCheckAll: false,
    };
  }

  drop(ev: any) {}

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  div1Function() {
    this.status = !this.status;
    if (this.div1 == false) {
      this.div1 = true;
      this.first_label = false;
    } else {
      this.div1 = false;
      this.first_label = true;
    }
  }
  titleOpen() {
    this.titleClicked = !this.titleClicked;
    if (this.title_filter == false) {
      this.title_filter = true;
      this.title_label = false;
    } else {
      this.title_filter = false;
      this.title_label = true;
    }
  }
  selectlevelFilter() {
    if (this.levelSelection == false) {
      this.levelSelection = true;
    } else {
      this.levelSelection = false;
    }
  }
  selectDepartment() {
    if (this.DepartmentSelection == false) {
      this.DepartmentSelection = true;
    } else {
      this.DepartmentSelection = false;
    }
  }
  selectLocation() {
    if (this.locationSelection == false) {
      this.locationSelection = true;
    } else {
      this.locationSelection = false;
    }
  }
  arr = [1, 4];
  addOnBlur = true;
  includeTitle: any = [{ name: "Included Title" }];
  excludeTitle: any = [{ name: "Excluded Title" }];
  addExclude(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our fruit
    if (value) {
      this.excludeTitle.push({ name: value });
    }

    // Clear the input value
    // event.chipInput!.clear();
  }
  removeExclude(content): void {
    const index = this.excludeTitle.indexOf(content);

    if (index >= 0) {
      this.excludeTitle.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our fruit
    if (value) {
      this.includeTitle.push({ name: value });
    }

    // Clear the input value
    // event.chipInput!.clear();
  }

  remove(content): void {
    const index = this.includeTitle.indexOf(content);

    if (index >= 0) {
      this.includeTitle.splice(index, 1);
    }
  }

  addLocation(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our country
    if ((value || "").trim()) {
      this.countries.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.countriesCtrl.setValue(null);
  }

  removeLocation(country: string): void {
    const index = this.countries.indexOf(country);

    if (index >= 0) {
      this.countries.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.countries.push(event.option.viewValue);
    // this.countryInput.nativeElement.value = '';
    this.countriesCtrl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCountries.filter(
      (country) => country.toLowerCase().indexOf(filterValue) === 0
    );
  }
  clearAll() {
    this.div1 = false;
    this.title_filter = false;
    this.first_label = false;
    this.levelSelection = false;
    this.DepartmentSelection = false;
    this.locationSelection = false;
    this.title_label = false;
  }
  vegetables: Vegetable[] = [{ name: "Banglore" }];
  countrys: Country[] = [{ name: "india" }];
}
