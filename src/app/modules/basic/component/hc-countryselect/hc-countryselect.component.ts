import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { countries } from 'src/app/modules/B2B/store/country-data-store';

@Component({
  selector: 'app-hc-countryselect',
  templateUrl: './hc-countryselect.component.html',
  styleUrls: ['./hc-countryselect.component.css']
})
export class HcCountryselectComponent implements OnInit {
  public countries: Array<any> = countries;
  @Input() countryCode: any = 'US';
  @Input() selectedCountry: any = { code:"US", code3:"USA", name:"United States", number:"1",flag:"US" };
  @Output() onCountrySelect: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  countrySelected(country) {
    // console.log(country)
    this.onCountrySelect.emit(country);
  }

}
