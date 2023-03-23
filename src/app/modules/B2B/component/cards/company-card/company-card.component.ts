import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { DataService } from 'src/app/modules/B2B/services/data.service';
import { SearchContactInput } from "src/app/modules/B2B/models/SearchContactModel";

@Component({
  selector: "app-company-card",
  templateUrl: "./company-card.component.html",
  styleUrls: ["./company-card.component.css"],
})
export class CompanyCardComponent implements OnInit {
  @Input() companyInfo: any;
  location: string = "";
  industry: any = [];
  sliceLength: number = 5;
  showMore: boolean = true;

  @Input() checkboxSelected: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Output() employeesSearched = new EventEmitter();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.location = this.makeLocation();
    this.getIndustryAndTechnology();
  }
  getIndustryAndTechnology() {
    this.industry.push(this.companyInfo.industry || []);
  }

  makeLocation(): string {
    const cityList = this.companyInfo.cityList
      ? this.companyInfo.cityList.toString() + ", "
      : "";
    const countryList = (this.companyInfo.countryList || []).toString();
    return cityList + countryList;
  }

  handleShowMore() {
    if (this.showMore == true) {
      this.sliceLength = this.industry.length;
    } else {
      this.sliceLength = 5;
    }
    this.showMore = !this.showMore;
  }

  openUrl(type) {
    const url = this.companyInfo[type];
    if (url !== "") {
      window.open("https://" + url, "popUpWindow");
    }
  }
  handleCheckboxChange(event) {
    this.checkboxChange.emit(this.checkboxSelected);
  }

  doSearchCompany(key: string, skill: any) {
    const companyObj: SearchCompanyInput = new SearchCompanyInput();
    companyObj[key] = [skill];
    this.dataService.passSearchCompanyInput(companyObj);
  }

  // To search employess in people tab
  doSearchContact(key: string, skill: any) {
    const contactObj: SearchContactInput = new SearchContactInput();
    contactObj[key] = [skill];
    this.dataService.passSearchContactInput(contactObj);
    this.employeesSearched.emit();
  }
}
