import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';

@Component({
  selector: 'app-individual-location-filter',
  templateUrl: './individual-location-filter.component.html',
  styleUrls: ['./individual-location-filter.component.css']
})
export class IndividualLocationFilterComponent implements OnInit, OnChanges {
  @Input() title: string = "Select location";
  @Input() selectedCountry: Array<any> = [];
  @Input() selectedStatesFromFilter: Array<any> = [];
  @Input() selectedCitiesFromFilter: Array<any> = [];
  @Input() countryList: Array<any> = [];
  @Input() stateList: Array<any> = [];
  @Input() cityList: Array<any> = [];
  @Input() disabled: boolean = false;
  @Input() searchQuota: number = 10;

  @Output() locationValueChanged = new EventEmitter();

  @ViewChild("countryInput")
  countryInput: ElementRef<HTMLInputElement>;
  countryControl: UntypedFormControl = new UntypedFormControl();

  @ViewChild("stateInput")
  stateInput: ElementRef<HTMLInputElement>;
  stateControl: UntypedFormControl = new UntypedFormControl();

  @ViewChild("cityInput")
  cityInput: ElementRef<HTMLInputElement>;
  cityControl: UntypedFormControl = new UntypedFormControl();

  selectedStates: Array<any> = [];
  selectedCities: Array<any> = [];
  selectable: boolean = true;

  constructor(private b2bService: AmplizService) { }

  ngOnInit() {
    this.handleForms();
    // this.getCountryList();
    this.getStateList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.selectedStatesFromFilter) {
      this.handleStateValue();
    }

    if(changes.selectedCitiesFromFilter) {
      this.handleCityValue();
    }
  }
  async handleStateValue() {
    if (this.selectedStatesFromFilter.length > 0) {
      this.selectedStates = this.stateList.filter(item => {
        return this.selectedStatesFromFilter.includes(item.state);
      });
      // this.selectedStatesFromFilter = [];
    } else {
      this.selectedStates = [];
    }
  }


  async handleCityValue() {
    if (this.selectedCitiesFromFilter.length > 0) {
      this.selectedCities = this.cityList.filter(item => {
        return this.selectedCitiesFromFilter.includes(item.city);
      });
      // this.selectedCitiesFromFilter = [];
    } else {
      this.selectedCities = [];
    }
  }

  handleForms() {
    // this.countryControl.valueChanges.subscribe((value: string) => {
    //   if (typeof value != "object") {
    //     this.getCountryList(value);
    //   }
    // });

    this.stateControl.valueChanges.subscribe((value: string) => {
      if (typeof value != "object") {
        this.getStateList(value);
      }
    });

    this.cityControl.valueChanges.subscribe((value: string) => {
      if (typeof value != "object") {
        this.getCityList(value);
      }
    });

  }


  getCountryList(value = "") {
    // this.b2bService.getCountryList(value).subscribe((res) => {
    //   this.countryList = res.countryList;
    //   this.getStateList();
    // });
  }

  // countrySelected(event) {
  //   const index = this.selectedCountry.findIndex(item => item.countryId == event.option.value.countryId);
  //   if (index == -1) {
  //     this.selectedCountry.push(event.option.value);
  //   }
  //   this.getStateList();
  //   this.omitChanges();
  // }
  // removeCountry(countryId: any) {
  //   if (countryId == 'all') {
  //     this.selectedCountry = []
  //   } else {
  //     const index = this.selectedCountry.findIndex(item => item.countryId == countryId);
  //     this.selectedCountry.splice(index, 1);
  //   }
  //   this.stateList = [];
  //   this.cityList = [];
  //   this.selectedStates = [];
  //   this.selectedCities = [];
  //   this.getStateList();
  //   this.omitChanges();
  // }

  removeState(state) {
    const stateIndex = this.selectedStates.findIndex(item => {
      return item.stateId == state.stateId
    });
    if (stateIndex != -1) {
      this.selectedStates.splice(stateIndex, 1);
      this.omitChanges();
      this.selectedCities = [];
    }
  }

  removeCity(city) {
    const cityIndex = this.selectedCities.findIndex(item => {
      return item.cityId == city.cityId
    });
    if (cityIndex != -1) {
      this.selectedCities.splice(cityIndex, 1);
      this.omitChanges();
    }
  }

  getStateList(value = "") {
    this.b2bService
      .getStateList({ searchPhase: value })
      .subscribe((res) => {
        this.stateList = res.stateDataList;
        this.handleStateValue();
        this.getCityList();
      });
  }

  selectStates(event) {
    this.stateInput.nativeElement.value = '';
    const receivedState = event.option.value;
    const found = this.selectedStates.findIndex(
      (ele) => ele.state === receivedState.state
    );
    if (found === -1) {
      this.selectedStates.push(receivedState);
      this.getCityList("");
      this.omitChanges();
    }
  }
  getCityList(value = "") {
    if (this.selectedStates.length > 0) {
      var tStates = this.selectedStates.map((state) => state.stateId);
      var params = { stateId: tStates, searchPhase: value };
      this.b2bService.searchCitiesForStates(params).subscribe((res) => {
        this.cityList = res.cityDataList;
        this.handleCityValue();
      });
    } else {
      this.selectedCities = [];
    }
  }


  onCitySelect(city: any) {
    this.cityInput.nativeElement.value = '';
    const found = this.selectedCities.findIndex(
      (ele) => ele.city === city.city
    );

    if (found !== -1) {
    } else {
      this.selectedCities.push(city);
      this.cityInput.nativeElement.value = "";
    }
    this.omitChanges();
  }

  omitChanges() {
    this.locationValueChanged.emit({
      country: this.selectedCountry,
      state: this.selectedStates,
      city: this.selectedCities
    });
  }
  clearState() {
    this.selectedStates = [];
    this.selectedCities = [];
    this.omitChanges();
  }
  clearCity() {
    this.selectedCities = [];
    this.omitChanges();
  }

}
