import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
  Inject,
  NgZone,
  PLATFORM_ID,
} from "@angular/core";
import { AmplizService } from "../../../services/ampliz.service";
import { CookieService } from "ngx-cookie-service";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { MatChipInputEvent } from "@angular/material/chips";

import {
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
} from "ng-apexcharts";
import {
  UntypedFormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { Router } from "@angular/router";

// HIghcharts start

import worldMap from "./worldmap";
import * as Highcharts from "highcharts/highmaps";
import { Options } from "highcharts";

// HIghcharts end

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}
export interface Industry_data {
  name: string;
}
export interface Lev_data {
  name: string;
}

export interface Emp_data {
  name: string;
}

export interface Department_data {
  name: string;
}

export interface Revenue_data {
  name: string;
}
export interface Location_data {
  name: string;
}

declare var chrome;
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};
export type IndChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboardfilter.component.html",
  styleUrls: ["./dashboardfilter.component.css"],
})
export class DashboardFilterComponent implements OnInit {
  @ViewChild("chart", { static: true }) chart: ChartComponent;

  // Highcharts: typeof Highcharts = Highcharts;
  Highcharts = Highcharts;
  chartConstructor = "mapChart";

  public chartOptions: Partial<ChartOptions>;
  public indChartOptions: Partial<IndChartOptions>;
  @Input() formContent: any;

  @Output() readonly formSubmit: EventEmitter<any> = new EventEmitter<any>();

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  panelOpenState = false;
  ind_data: Industry_data[] = [];
  dept_data: Department_data[] = [];
  lev_data: Lev_data[] = [];
  emp_data: Emp_data[] = [];
  rev_data: Revenue_data[] = [];
  loc_data: Location_data[] = [];
  searchedKeyword: string;
  activeStepIndex: number;
  currentFormContent: Array<any>;
  formData: any;
  finalreport: any;
  formFields: Array<Array<string>>;
  masterFormFields: Array<string>;
  stepItems: Array<any>;
  masterForm: Array<UntypedFormGroup>;
  industry = false;
  test = true;
  location = true;
  level = false;
  emp = false;
  rev = false;
  deptmnt = false;
  resultDash = false;
  filterSelect = true;
  industry_data = [
    { name: "Airlines/Aviation", checked: false },
    { name: "Alternative Dispute Resolution", checked: false },
    { name: "Alternative Medicine", checked: false },
    { name: "Animation", checked: false },
    { name: "Apparel & Fashion", checked: false },
    { name: "Architecture & Planning", checked: false },
    { name: "Arts and Crafts", checked: false },
    { name: "Automotive", checked: false },
    { name: "Aviation & Aerospace", checked: false },
    { name: "Banking", checked: false },
    { name: "Biotechnology", checked: false },
    { name: "Broadcast Media", checked: false },
    { name: "Building Materials", checked: false },
    { name: "Business Supplies and Equipment", checked: false },
    { name: "Capital Markets", checked: false },
    { name: "Chemicals", checked: false },
    { name: "Civic & Social Organization", checked: false },
    { name: "Civil Engineering", checked: false },
    { name: "Commercial Real Estate", checked: false },
    { name: "Computer & Network Security", checked: false },
    { name: "Computer Games", checked: false },
    { name: "Computer Hardware", checked: false },
    { name: "Computer Networking", checked: false },
    { name: "Computer Software", checked: false },
    { name: "Construction", checked: false },
    { name: "Consumer Electronics", checked: false },
    { name: "Consumer Goods", checked: false },
    { name: "Consumer Services", checked: false },
    { name: "Cosmetics", checked: false },
    { name: "Dairy", checked: false },
    { name: "Defense & Space", checked: false },
    { name: "Design", checked: false },
    { name: "Education Management", checked: false },
    { name: "E-Learning", checked: false },
    { name: "Electrical/Electronic Manufacturing", checked: false },
    { name: "Entertainment", checked: false },
    { name: "Environmental Services", checked: false },
    { name: "Events Services", checked: false },
    { name: "Executive Office", checked: false },
    { name: "Facilities Services", checked: false },
    { name: "Farming", checked: false },
    { name: "Financial Services", checked: false },
    { name: "Fine Art", checked: false },
    { name: "Fishery", checked: false },
    { name: "Food & Beverages", checked: false },
    { name: "Food Production", checked: false },
    { name: "Fund-Raising", checked: false },
    { name: "Furniture", checked: false },
    { name: "Gambling & Casinos", checked: false },
    { name: "Glass, Ceramics & Concrete", checked: false },
    { name: "Government Administration", checked: false },
    { name: "Government Relations", checked: false },
    { name: "Graphic Design", checked: false },
    { name: "Health, Wellness and Fitness", checked: false },
    { name: "Higher Education", checked: false },
    { name: "Hospital & Health Care", checked: false },
    { name: "Hospitality", checked: false },
    { name: "Human Resources", checked: false },
    { name: "Import and Export", checked: false },
    { name: "Individual & Family Services", checked: false },
    { name: "Industrial Automation", checked: false },
    { name: "Information Services", checked: false },
    { name: "Information Technology and Services", checked: false },
    { name: "Insurance", checked: false },
    { name: "International Affairs", checked: false },
    { name: "International Trade and Development", checked: false },
    { name: "Internet", checked: false },
    { name: "Investment Banking", checked: false },
    { name: "Investment Management", checked: false },
    { name: "Judiciary", checked: false },
    { name: "Law Enforcement", checked: false },
    { name: "Law Practice", checked: false },
    { name: "Legal Services", checked: false },
    { name: "Legislative Office", checked: false },
    { name: "Leisure, Travel & Tourism", checked: false },
    { name: "Libraries", checked: false },
    { name: "Logistics and Supply Chain", checked: false },
    { name: "Luxury Goods & Jewelry", checked: false },
    { name: "Machinery", checked: false },
    { name: "Management Consulting", checked: false },
    { name: "Maritime", checked: false },
    { name: "Market Research", checked: false },
    { name: "Marketing and Advertising", checked: false },
    { name: "Mechanical or Industrial Engineering", checked: false },
    { name: "Media Production", checked: false },
    { name: "Medical Devices", checked: false },
    { name: "Medical Practice", checked: false },
    { name: "Mental Health Care", checked: false },
    { name: "Military", checked: false },
    { name: "Mining & Metals", checked: false },
    { name: "Motion Pictures and Film", checked: false },
    { name: "Museums and Institutions", checked: false },
    { name: "Music", checked: false },
    { name: "Nanotechnology", checked: false },
    { name: "Newspapers", checked: false },
    { name: "Non-Profit Organization Management", checked: false },
    { name: "Oil & Energy", checked: false },
    { name: "Online Media", checked: false },
    { name: "Outsourcing/Offshoring", checked: false },
    { name: "Package/Freight Delivery", checked: false },
    { name: "Packaging and Containers", checked: false },
    { name: "Paper & Forest Products", checked: false },
    { name: "Performing Arts", checked: false },
    { name: "Pharmaceuticals", checked: false },
    { name: "Philanthropy", checked: false },
    { name: "Photography", checked: false },
    { name: "Plastics", checked: false },
    { name: "Political Organization", checked: false },
    { name: "Primary/Secondary Education", checked: false },
    { name: "Printing", checked: false },
    { name: "Professional Training & Coaching", checked: false },
    { name: "Program Development", checked: false },
    { name: "Public Policy", checked: false },
    { name: "Public Relations and Communications", checked: false },
    { name: "Public Safety", checked: false },
    { name: "Publishing", checked: false },
    { name: "Railroad Manufacture", checked: false },
    { name: "Ranching", checked: false },
    { name: "Real Estate", checked: false },
    { name: "Recreational Facilities and Services", checked: false },
    { name: "Religious Institutions", checked: false },
    { name: "Renewables & Environment", checked: false },
    { name: "Research", checked: false },
    { name: "Restaurants", checked: false },
    { name: "Retail", checked: false },
    { name: "Security and Investigations", checked: false },
    { name: "Semiconductors", checked: false },
    { name: "Shipbuilding", checked: false },
    { name: "Sporting Goods", checked: false },
    { name: "Sports", checked: false },
    { name: "Staffing and Recruiting", checked: false },
    { name: "Supermarkets", checked: false },
    { name: "Telecommunications", checked: false },
    { name: "Textiles", checked: false },
    { name: "Think Tanks", checked: false },
    { name: "Tobacco", checked: false },
    { name: "Translation and Localization", checked: false },
    { name: "Transportation/Trucking/Railroad", checked: false },
    { name: "Utilities", checked: false },
    { name: "Venture Capital & Private Equity", checked: false },
    { name: "Veterinary", checked: false },
    { name: "Warehousing", checked: false },
    { name: "Wholesale", checked: false },
    { name: "Wine and Spirits", checked: false },
    { name: "Wireless", checked: false },
    { name: "Writing and Editing", checked: false },
  ];

  // deptartment_data = [{ "name": "Account", "checked": false }, { "name": "Architect", "checked": false }, { "name": "Arts&Entertainment", "checked": false }, { "name": "B&D", "checked": false }, { "name": "Board Member", "checked": false }, { "name": "Consultants", "checked": false }, { "name": "Customer Service", "checked": false }, { "name": "Defense", "checked": false}, { "name": "Education", "checked": false}, { "name": "Engineer", "checked": false}, { "name": "Finance", "checked": false }, { "name": "Government", "checked": false }, { "name": "HR", "checked": false }, { "name": "IT", "checked": false }, { "name": "Legal", "checked": false }, { "name": "Manufacturing", "checked": false }, { "name": "Marketing", "checked": false }, { "name": "Medical", "checked": false }, { "name": "Operation", "checked": false }, { "name": "Others", "checked": false }, { "name": "Partner", "checked": false }, { "name": "Purchasing", "checked": false }, { "name": "Quality", "checked": false }, { "name": "R&D", "checked": false }, { "name": "Sales", "checked": false }, { "name": "Sales&Marketing", "checked": false }, { "name": "Sub Level Management", "checked": false }, { "name": "Top Level Management", "checked": false }, { "name": "Top Management", "checked": false }];
  deptartment_data = [
    { name: "Finance", checked: false },

    { name: "Medical", checked: false },

    { name: "Education", checked: false },

    { name: "Engineer", checked: false },

    { name: "Sales", checked: false },

    { name: "Others", checked: false },

    { name: "Marketing", checked: false },

    { name: "Sub Level  Management", checked: false },

    { name: "HR", checked: false },

    { name: "IT", checked: false },

    { name: "Operation", checked: false },

    { name: "Top Level  Management", checked: false },

    { name: "Account", checked: false },

    { name: "Customer  Service", checked: false },

    { name: "Arts&Entertainment", checked: false },

    { name: "B&D", checked: false },

    { name: "Legal", checked: false },

    { name: "R&D", checked: false },

    { name: "Consultants", checked: false },

    { name: "Purchasing", checked: false },

    { name: "Defense", checked: false },

    { name: "Architect", checked: false },

    { name: "Manufacturing", checked: false },

    { name: "Quality", checked: false },

    { name: "Partner", checked: false },

    { name: "Government", checked: false },

    { name: "Sales&Marketing", checked: false },

    { name: "Board  Member", checked: false },

    { name: "Top  Management", checked: false },
  ];
  level_data = [
    { name: "C-Level", checked: false },
    { name: "VP-Level", checked: false },
    { name: "Director", checked: false },
    { name: "Managers", checked: false },
    { name: "Non-Managers", checked: false },
  ];
  employee_data = [
    { name: "0-10", checked: false, val: "0-10" },
    { name: "11-50", checked: false, val: "11-50" },
    { name: "51-200", checked: false, val: "51-200" },
    { name: "201-1000", checked: false, val: "201-1000" },
    { name: "1001-10000", checked: false, val: "1001-10000" },
    { name: ">10000", checked: false, val: "10,001+" },
  ];
  revenue_data = [
    { name: "0-1M", checked: false, val: "0-1" },
    { name: "1M-5M", checked: false, val: "1-5" },
    { name: "5M-25M", checked: false, val: "5-25" },
    { name: "25M-100M", checked: false, val: "25-100" },
    { name: ">1B", checked: false, val: "1000" },
  ];

  location_data = [
    {
      name: "United States",
      flag: "assets/images/png/153-united-states-of-america.png",
      checked: false,
    },
    {
      name: "United Kingdom",
      flag: "assets/images/png/262-united-kingdom.png",
      checked: false,
    },
    {
      name: "India",
      flag: "assets/images/png/217-india.png",
      checked: false,
    },
    {
      name: "Afghanistan",
      flag: "assets/images/png/122-afghanistan.png",
      checked: false,
    },
    {
      name: "Algeria",
      flag: "assets/images/png/126-algeria.png",
      checked: false,
    },
    {
      name: "Argentina",
      flag: "assets/images/png/064-argentina.png",
      checked: false,
    },
    {
      name: "Australia",
      flag: "assets/images/png/130-australia.png",
      checked: false,
    },
    {
      name: "Austria",
      flag: "assets/images/png/189-austria.png",
      checked: false,
    },
    {
      name: "Azerbaijan",
      flag: "assets/images/png/125-azerbaijan.png",
      checked: false,
    },
    {
      name: "Bahrain",
      flag: "assets/images/png/116-bahrain.png",
      checked: false,
    },
    {
      name: "Bangladesh",
      flag: "assets/images/png/128-bangladesh.png",
      checked: false,
    },
    {
      name: "Belarus",
      flag: "assets/images/png/110-belarus.png",
      checked: false,
    },
    {
      name: "Belgium",
      flag: "assets/images/png/054-belgium.png",
      checked: false,
    },
    {
      name: "Bolivia",
      flag: "assets/images/png/133-bolivia.png",
      checked: false,
    },
    {
      name: "Bosnia and Herzegovina",
      flag: "assets/images/png/113-bosnia-and-herzegovina.png",
      checked: false,
    },
    {
      name: "Brazil",
      flag: "assets/images/png/250-brazil.png",
      checked: false,
    },
    {
      name: "Bulgaria",
      flag: "assets/images/png/135-bulgaria.png",
      checked: false,
    },
    {
      name: "Cambodia",
      flag: "assets/images/png/132-cambodia.png",
      checked: false,
    },
    {
      name: "Canada",
      flag: "assets/images/png/206-canada.png",
      checked: false,
    },
    {
      name: "Chile",
      flag: "assets/images/png/051-chile.png",
      checked: false,
    },
    {
      name: "China",
      flag: "assets/images/png/261-china.png",
      checked: false,
    },
    {
      name: "Colombia",
      flag: "assets/images/png/062-colombia.png",
      checked: false,
    },
    {
      name: "Costa Rica",
      flag: "assets/images/png/131-costa-rica.png",
      checked: false,
    },
    {
      name: "Croatia",
      flag: "assets/images/png/134-croatia.png",
      checked: false,
    },
    {
      name: "Cyprus",
      flag: "assets/images/png/030-cyprus.png",
      checked: false,
    },
    {
      name: "Czech Republic",
      flag: "assets/images/png/061-czech-republic.png",
      checked: false,
    },
    {
      name: "Denmark",
      flag: "assets/images/png/072-denmark.png",
      checked: false,
    },
    {
      name: "Dominican Republic",
      flag: "assets/images/png/018-dominican-republic.png",
      checked: false,
    },
    {
      name: "Ecuador",
      flag: "assets/images/png/049-ecuador.png",
      checked: false,
    },
    {
      name: "Egypt",
      flag: "assets/images/png/079-egypt.png",
      checked: false,
    },
    {
      name: "Estonia",
      flag: "assets/images/png/257-estonia.png",
      checked: false,
    },
    {
      name: "Finland",
      flag: "assets/images/png/052-finland.png",
      checked: false,
    },
    {
      name: "France",
      flag: "assets/images/png/077-france.png",
      checked: false,
    },
    {
      name: "Georgia",
      flag: "assets/images/png/256-georgia.png",
      checked: false,
    },
    {
      name: "Germany",
      flag: "assets/images/png/066-germany.png",
      checked: false,
    },
    {
      name: "Ghana",
      flag: "assets/images/png/255-ghana.png",
      checked: false,
    },
    {
      name: "Greece",
      flag: "assets/images/png/071-greece.png",
      checked: false,
    },
    {
      name: "Guatemala",
      flag: "assets/images/png/040-guatemala.png",
      checked: false,
    },
    {
      name: "Hong Kong",
      flag: "assets/images/png/067-hong-kong.png",
      checked: false,
    },
    {
      name: "Hungary",
      flag: "assets/images/png/053-hungary.png",
      checked: false,
    },
    {
      name: "Iceland",
      flag: "assets/images/png/041-iceland.png",
      checked: false,
    },
    {
      name: "Indonesia",
      flag: "assets/images/png/078-indonesia.png",
      checked: false,
    },
    {
      name: "Iran",
      flag: "assets/images/png/063-iran.png",
      checked: false,
    },
    {
      name: "Ireland",
      flag: "assets/images/png/070-ireland.png",
      checked: false,
    },
    {
      name: "Israel",
      flag: "assets/images/png/060-israel.png",
      checked: false,
    },
    {
      name: "Italy",
      flag: "assets/images/png/011-italy.png",
      checked: false,
    },
    {
      name: "Japan",
      flag: "assets/images/png/033-japan.png",
      checked: false,
    },
    {
      name: "Jordan",
      flag: "assets/images/png/042-jordan.png",
      checked: false,
    },
    {
      name: "Kazakhstan",
      flag: "assets/images/png/034-kazakhstan.png",
      checked: false,
    },
    {
      name: "Kenya",
      flag: "assets/images/png/029-kenya.png",
      checked: false,
    },
    {
      name: "Korea",
      flag: "assets/images/png/055-south-korea.png",
      checked: false,
    },
    {
      name: "Kuwait",
      flag: "assets/images/png/178-kuwait.png",
      checked: false,
    },
    {
      name: "Latvia",
      flag: "assets/images/png/032-latvia.png",
      checked: false,
    },
    {
      name: "Lebanon",
      flag: "assets/images/png/008-lebanon.png",
      checked: false,
    },
    {
      name: "Lithuania",
      flag: "assets/images/png/025-lithuania.png",
      checked: false,
    },
    {
      name: "Luxembourg",
      flag: "assets/images/png/023-luxembourg.png",
      checked: false,
    },
    {
      name: "Macedonia",
      flag: "assets/images/png/223-republic-of-macedonia.png",
      checked: false,
    },
    {
      name: "Malaysia",
      flag: "assets/images/png/056-malaysia.png",
      checked: false,
    },
    {
      name: "Malta",
      flag: "assets/images/png/012-malta.png",
      checked: false,
    },
    {
      name: "Mexico",
      flag: "assets/images/png/239-mexico.png",
      checked: false,
    },
    {
      name: "Morocco",
      flag: "assets/images/png/086-morocco.png",
      checked: false,
    },
    {
      name: "Nepal",
      flag: "assets/images/png/249-nepal.png",
      checked: false,
    },
    {
      name: "Netherlands",
      flag: "assets/images/png/195-netherlands.png",
      checked: false,
    },
    {
      name: "New Zealand",
      flag: "assets/images/png/048-new-zealand.png",
      checked: false,
    },
    {
      name: "Nigeria",
      flag: "assets/images/png/010-nigeria.png",
      checked: false,
    },
    {
      name: "Norway",
      flag: "assets/images/png/058-norway.png",
      checked: false,
    },
    // {
    //   "name": "Other",
    //   "flag":"assets/images/png/.png",
    //   "checked": false
    // },
    {
      name: "Pakistan",
      flag: "assets/images/png/031-pakistan.png",
      checked: false,
    },
    {
      name: "Panama",
      flag: "assets/images/png/047-panama.png",
      checked: false,
    },
    {
      name: "Peru",
      flag: "assets/images/png/074-peru.png",
      checked: false,
    },
    {
      name: "Philippines",
      flag: "assets/images/png/076-philippines.png",
      checked: false,
    },
    {
      name: "Poland",
      flag: "assets/images/png/108-poland.png",
      checked: false,
    },
    {
      name: "Portugal",
      flag: "assets/images/png/174-portugal.png",
      checked: false,
    },
    {
      name: "Puerto Rico",
      flag: "assets/images/png/005-puerto-rico.png",
      checked: false,
    },
    {
      name: "Qatar",
      flag: "assets/images/png/019-qatar.png",
      checked: false,
    },
    {
      name: "Romania",
      flag: "assets/images/png/050-romania.png",
      checked: false,
    },
    {
      name: "Russian Federation",
      flag: "assets/images/png/228-russia.png",
      checked: false,
    },
    {
      name: "Saudi Arabia",
      flag: "assets/images/png/059-saudi-arabia.png",
      checked: false,
    },
    {
      name: "Serbia",
      flag: "assets/images/png/035-serbia.png",
      checked: false,
    },
    {
      name: "Singapore",
      flag: "assets/images/png/141-singapore.png",
      checked: false,
    },
    {
      name: "Slovak Republic",
      flag: "assets/images/png/045-slovakia.png",
      checked: false,
    },
    {
      name: "Slovenia",
      flag: "assets/images/png/004-slovenia.png",
      checked: false,
    },
    {
      name: "South Africa",
      flag: "assets/images/png/075-south-africa.png",
      checked: false,
    },
    {
      name: "Spain",
      flag: "assets/images/png/044-spain.png",
      checked: false,
    },
    {
      name: "Sri Lanka",
      flag: "assets/images/png/238-sri-lanka.png",
      checked: false,
    },
    {
      name: "Sweden",
      flag: "assets/images/png/073-sweden.png",
      checked: false,
    },
    {
      name: "Switzerland",
      flag: "assets/images/png/097-switzerland.png",
      checked: false,
    },
    {
      name: "Taiwan",
      flag: "assets/images/png/080-taiwan.png",
      checked: false,
    },
    {
      name: "Tanzania",
      flag: "assets/images/png/003-tanzania.png",
      checked: false,
    },
    {
      name: "Thailand",
      flag: "assets/images/png/184-thailand.png",
      checked: false,
    },
    {
      name: "Tunisia",
      flag: "assets/images/png/013-tunisia.png",
      checked: false,
    },
    {
      name: "Turkey",
      flag: "assets/images/png/119-turkey.png",
      checked: false,
    },
    {
      name: "Uganda",
      flag: "assets/images/png/009-uganda.png",
      checked: false,
    },
    {
      name: "Ukraine",
      flag: "assets/images/png/065-ukraine.png",
      checked: false,
    },
    {
      name: "United Arab Emirates",
      flag: "assets/images/png/068-united-arab-emirates.png",
      checked: false,
    },
    {
      name: "Uruguay",
      flag: "assets/images/png/038-uruguay.png",
      checked: false,
    },
    {
      name: "Venezuela",
      flag: "assets/images/png/057-venezuela.png",
      checked: false,
    },
    {
      name: "Vietnam",
      flag: "assets/images/png/164-vietnam.png",
      checked: false,
    },
  ];
  emails = [
    { email: "test", checked: false },
    { email: "basha", checked: false },
    { email: "hello", checked: false },
    { email: "email4", checked: false },
  ];
  emails1 = [
    { email1: "email5", checked: true },
    { email1: "email6", checked: true },
    { email1: "email7", checked: true },
    { email1: "email8", checked: true },
  ];
  myForm: UntypedFormGroup;
  myForm1: UntypedFormGroup;
  bioSection = new UntypedFormGroup({
    firstName: new UntypedFormControl(""),
    lastName: new UntypedFormControl(""),
    age: new UntypedFormControl(""),
    stackDetails: new UntypedFormGroup({
      stack: new UntypedFormControl(""),
      experience: new UntypedFormControl(""),
    }),
    address: new UntypedFormGroup({
      country: new UntypedFormControl(""),
      city: new UntypedFormControl(""),
    }),
  });
  contactForm: UntypedFormGroup;
  submitted = false;
  constructor(
    private amplizService: AmplizService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private readonly _formBuilder: UntypedFormBuilder,
    private fb: UntypedFormBuilder,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}
  itemsAsObjects = [{ name: "Angular" }, { name: "React" }];
  itemsAsObjects1 = [{ name: "Angular1" }, { name: "React1" }];
  subscriptions = [];
  chromeData = {};
  currentCredit = 0;
  creditsremaining = 0;
  button = "";
  access_token = "";
  refresh_token = "";
  username = "";
  CurrentCredits = "";
  isPersonaSet = "";
  email_id = "";
  public user = null;
  showChrmBtn: boolean;
  public headerData;
  hasExtension: boolean = true;
  subscribed: boolean;
  chrome_button = "";
  emailFormArray: any;
  SelEmail: any = [];
  inds: any = [];
  dept: any = [];
  loc: any = [];
  loc1: any = [];
  levs: any = [];
  revs: any = [];
  inds1: any = [];
  dept1: any = [];
  levs1: any = [];
  emp1: any = [];
  revs1: any = [];
  sel_rev_max = "";
  hTLocations: any = [];
  chartOption: any;
  spinner: boolean = false;
  isCollapse: boolean = false;
  name: string;
  progresValue: number = 10;
  ngOnInit() {
    this.access_token = this.cookieService.get("auth_token");
    this.refresh_token = this.cookieService.get("refresh_token");
    this.username = this.cookieService.get("username");
    this.CurrentCredits = this.cookieService.get("credits");
    this.isPersonaSet = this.cookieService.get("isPersonaSet");
    this.email_id = this.cookieService.get("email_id");
    //
    this.createContactForm();
    if (this.access_token != "") {
      localStorage.setItem("auth_token", this.access_token);
    }
    if (this.username != "") {
      localStorage.setItem("username", this.username);
    }
    if (this.refresh_token != "") {
      localStorage.setItem("refresh_token", this.refresh_token);
    }
    if (this.isPersonaSet != "") {
      localStorage.setItem("isPersonaSet", this.isPersonaSet.toString());
    }

    if (this.CurrentCredits != "") {
      localStorage.setItem("credits", this.CurrentCredits.toString());
    }
    //  this.checkChromeExtenstion();
    this.getDashboardDetails();

    this.activeStepIndex = 0;
    this.masterForm = [];
    this.currentFormContent = [];
    this.formFields = [];

    this.myForm = this.fb.group({
      useremail: this.fb.array([]),
    });
    this.myForm1 = this.fb.group({
      useremail1: this.fb.array([]),
    });
    this.name = localStorage.getItem("username");
    //
    // if(this.location == true){
    // this.remainStep = "4";
    // }
  }

  showPanel() {
    this.isCollapse = !this.isCollapse;
  }
  closepanel() {
    this.isCollapse = false;
  }
  bookDemo(url) {
    const Durl = "https://" + url;
    window.open(Durl);
  }

  checkChromeExtenstion() {
    chrome.runtime.sendMessage(
      "abgoaphadkcmbkapnamhkcgkaddlmfal",
      { message: "isinstalled" },
      (response) => {
        if (chrome.runtime.lastError) {
          this.showChrmBtn = true;
          this.chromeData = {
            chrome_status: "Not Installed",
          };
        } else {
          this.showChrmBtn = false;

          this.chromeData = {
            chrome_status: "Installed",
          };
        }
        this.amplizService.chromeStatus(this.chromeData).subscribe(
          (res) => {
            //
          },

          (error) => {
            //
          }
        );
      }
    );

    // chrome.runtime.sendMessage("dnjagggnhjnlhihfgnfcfbbhghjibjca", { message: "isinstalled" },
    // function (reply) {

    //   if(chrome.runtime.lastError) {
    //
    //    this.showChrmBtn = true;
    //

    //   }

    //     if (reply) {

    //
    //     this.hasExtension = true;
    //     }

    //     // if (reply) {
    //     //

    //     //   this.hasExtension = true
    //     // }
    //     // else {
    //     //   this.hasExtension = false;
    //     // }
    //     // if(chrome.runtime.lastError) {
    //     //   this.hasExtension = false;
    //     //   this.chrome_button = "Chrome Install"

    //     // }
    // });
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.subscriptions = res.Subscriptions;
          //
          this.creditsremaining = res.Subscriptions[0].SubscriptionCredits;
          //
          if (res.Subscriptions[0].SubscriptionName == "Subscription1") {
            localStorage.setItem("plan", "Basic");
          } else {
            localStorage.setItem("plan", res.Subscriptions[0].SubscriptionName);
          }
          if (res.Subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Request Pricing";
          }
          if (res.Subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
            this.button = "button";
          }
          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Request Pricing";

            this.button = "Request Pricing";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
            this.button = "button";
          }
          this.currentCredit = this.creditsremaining - res.CurrentCredits;
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
          //
        }
      );
    } else {
      this.amplizService.logout();
    }
  }

  activedStep = 0;

  model = {};
  steps: StepType[] = [
    {
      label: "Personal data",
      fields: [
        {
          key: "firstname",
          type: "input",
          templateOptions: {
            label: "First name",
            required: true,
          },
        },
        {
          key: "gender",
          type: "radio",
          templateOptions: {
            type: "radio",
            label: "Gender",
            required: true,
            name: "gender",
            options: [
              { value: "Male", key: "M" },
              { value: "Female", key: "F" },
            ],
          },
        },
        {
          key: "age",
          type: "checkbox",
          templateOptions: {
            type: "number",
            label: "Age",
            required: false,
          },
        },
      ],
    },
    {
      label: "Destination",
      fields: [
        {
          key: "country",
          type: "input",
          templateOptions: {
            label: "Country",
            required: true,
          },
        },
      ],
    },
    {
      label: "Day of the trip",
      fields: [
        {
          key: "day",
          type: "input",
          templateOptions: {
            type: "date",
            label: "Day of the trip",
            required: true,
          },
        },
      ],
    },
  ];

  form = new UntypedFormArray(this.steps.map(() => new UntypedFormGroup({})));
  options = this.steps.map(() => <FormlyFormOptions>{});

  prevStep(step) {
    this.activedStep = step - 1;
  }

  nextStep(step) {
    this.activedStep = step + 1;
  }

  submit() {
  }

  // build separate FormGroups for each form
  buildForm(currentFormContent: any): UntypedFormGroup {
    const formDetails = Object.keys(currentFormContent).reduce((obj, key) => {
      obj[key] = ["", this.getValidators(currentFormContent[key])];

      return obj;
    }, {});

    return this._formBuilder.group(formDetails);
  }

  // get validator(s) for each field, if any
  getValidators(formField: any): Validators {
    const fieldValidators = Object.keys(formField.validations).map(
      (validator) => {
        if (validator === "required") {
          return Validators[validator];
        } else {
          return Validators[validator](formField.validations[validator]);
        }
      }
    );

    return fieldValidators;
  }

  // get validation error messages per error, per field
  getValidationMessage(formIndex: number, formFieldName: string): string {
    const formErrors = this.masterForm[formIndex].get(formFieldName).errors;
    const errorMessages =
      this.currentFormContent[formIndex][formFieldName].errors;
    const validationError = errorMessages[Object.keys(formErrors)[0]];

    return validationError;
  }

  goToStep(step: string): void {
    this.activeStepIndex =
      step === "prev" ? this.activeStepIndex - 1 : this.activeStepIndex + 1;

    this.setFormPreview();
  }

  setFormPreview(): void {
    this.formData = this.masterForm.reduce(
      (masterForm, currentForm) => ({ ...masterForm, ...currentForm.value }),
      {}
    );

    this.masterFormFields = Object.keys(this.formData);
  }

  onFormSubmit(): void {
    this.formSubmit.emit(this.formData);
  }

  trackByFn(index: number): number {
    return index;
  }

  showloc() {
    this.industry = false;
    this.level = false;
    this.emp = false;
    this.location = true;
    if (this.location == true) {
      this.remainStep = "4";
      this.progresValue = 10;
    }
    this.rev = false;
    this.deptmnt = false;
  }

  showdep() {
    this.industry = false;
    this.level = false;
    this.emp = false;
    this.location = false;
    this.rev = false;
    this.deptmnt = true;
    if (this.deptmnt == true) {
      this.remainStep = "1";
      this.progresValue = 60;
    }
    this.searchedKeyword = "";
  }
  showdepEmptyValues() {
    this.emp = false;
    this.deptmnt = true;
    if (this.deptmnt == true) {
      this.remainStep = "1";
      this.progresValue = 60;
    }
    this.emp_data = [];
    this.emp1 = [];
    for (let i = 0, l = this.employee_data.length; i < l; i++) {
      this.employee_data[i].checked = false;
    }
    this.searchedKeyword = "";
  }

  remainStep: string = "4";

  showindus() {
    this.industry = true;
    this.progresValue = 20;
    if (this.industry == true) {
      this.remainStep = "3";
    }
    this.level = false;
    this.emp = false;
    this.location = false;
    this.rev = false;
    this.deptmnt = false;
    this.searchedKeyword = "";
  }
  showlevel() {
    this.industry = false;
    this.location = false;
    this.level = true;
    this.progresValue = 80;
    this.emp = false;
    this.rev = false;
    this.deptmnt = false;
    this.searchedKeyword = "";
  }
  showlevelEmptyValues() {
    this.deptmnt = false;
    this.level = true;
    this.progresValue = 80;
    // if(this.level == true){
    //   this.remainStep = "1";
    // }
    this.dept_data = [];
    this.dept1 = [];
    for (let i = 0, l = this.deptartment_data.length; i < l; i++) {
      this.deptartment_data[i].checked = false;
    }
    this.searchedKeyword = "";
  }
  showemp() {
    this.industry = false;
    this.location = false;
    this.level = false;
    this.emp = true;
    this.progresValue = 40;

    this.rev = false;
    this.deptmnt = false;
    if (this.emp == true) {
      this.remainStep = "2";
    }
    this.searchedKeyword = "";
  }
  showempEmptyValues() {
    this.industry = false;
    this.emp = true;
    if (this.emp == true) {
      this.remainStep = "2";
      this.progresValue = 40;
    }
    this.ind_data = [];
    this.inds1 = [];
    for (let i = 0, l = this.industry_data.length; i < l; i++) {
      this.industry_data[i].checked = false;
    }
    this.searchedKeyword = "";
  }
  showrev() {
    this.industry = false;
    this.location = false;
    this.level = false;
    this.emp = false;
    this.rev = true;
    this.deptmnt = false;
    this.searchedKeyword = "";
  }

  prevtest() {
    this.industry = false;
    this.test = true;
    this.location = false;
    this.rev = false;
    this.level = false;
  }

  prevloc() {
    this.industry = false;
    this.test = false;
    this.location = true;
    this.rev = false;
    this.emp = false;
  }
  showLocation() {
    // this.rev = false;
    this.emp = true;
    this.location = false;
    this.searchedKeyword = "";
  }
  showEmployee() {
    this.location = false;
    this.emp = true;
    this.searchedKeyword = "";
  }
  showSeniority() {
    this.emp = false;
    this.level = true;
    this.searchedKeyword = "";
  }
  onChange(name: string, isChecked: boolean) {
    const emailFormArray = <UntypedFormArray>this.myForm.controls.useremail;

    if (isChecked) {
      emailFormArray.push(new UntypedFormControl(name));
      Object.keys(this.industry_data).forEach((key) => {
        if (this.industry_data[key]) {
          this.industry_data["checked"] = true;
        }
      });
      for (let i = 0, l = this.industry_data.length; i < l; i++) {
        if (this.industry_data[i].name === name) {
          this.industry_data[i].checked = true;
        }
        //
        // ...
      }
    } else {
      let index = emailFormArray.controls.findIndex((x) => x.value == name);
      emailFormArray.removeAt(index);
    }
  }

  onChange1(email: string, isChecked: boolean) {
    const emailFormArray = <UntypedFormArray>this.myForm1.controls.useremail1;

    if (isChecked) {
      emailFormArray.push(new UntypedFormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex((x) => x.value == email);
      emailFormArray.removeAt(index);
    }
  }

  onChange2(name) {
    for (let i = 0, l = this.industry_data.length; i < l; i++) {
      if (this.industry_data[i].name == name) {
        if (!this.industry_data[i].checked) {
          this.industry_data[i].checked = true;
          const email = this.industry_data[i].name;
          let test = JSON.stringify({ name: name });
          let test1 = { name: name };
          // Add our fruit
          if ((name || "").trim()) {
            this.ind_data.push({ name: name.trim() });
          }
          // this.ind_data.push({name: email.trim()});
          // this.inds.push(test);
          this.inds1.push(name);

          this.itemsAsObjects1.push(test1);
        } else {
          this.inds1 = this.inds1.filter((a) => a !== name);
          this.industry_data[i].checked = false;
          const name1 = this.industry_data[i].name;
          let ind = { name: name1 };
          var data1 = [name1];

          let j = this.itemsAsObjects1.length;
          while (j--) {
            if (data1.indexOf(this.itemsAsObjects1[j].name) != -1) {
              this.itemsAsObjects1.splice(j, 1);
            }
          }

          let k = this.ind_data.length;
          while (k--) {
            if (data1.indexOf(this.ind_data[k].name) != -1) {
              this.ind_data.splice(k, 1);
            }
          }
        }
      }
    }
  }

  onChange3(name) {
    for (let i = 0, l = this.deptartment_data.length; i < l; i++) {
      if (this.deptartment_data[i].name == name) {
        if (!this.deptartment_data[i].checked) {
          this.deptartment_data[i].checked = true;
          const email = this.deptartment_data[i].name;
          // let test = JSON.stringify({ "name": name })
          // let test1 = { "name": name }

          if ((name || "").trim()) {
            this.dept_data.push({ name: name.trim() });
          }
          // this.ind_data.push({name: email.trim()});
          // this.dept.push(test);
          this.dept1.push(email);
        } else {
          this.dept1 = this.dept1.filter((a) => a !== name);
          this.deptartment_data[i].checked = false;
          const name1 = this.deptartment_data[i].name;
          let ind = { name: name1 };
          var data1 = [name1];
          let k = this.dept_data.length;
          while (k--) {
            if (data1.indexOf(this.dept_data[k].name) != -1) {
              this.dept_data.splice(k, 1);
            }
          }
        }
        // this.emailFormArray = <FormArray>this.myForm.controls.useremail1;
        // this.SelEmail = this.SelEmail.push(email);
        // this.emailFormArray = this.emailFormArray.push(new FormControl(name));
      }
    }
  }
  seniorityVal: any = [];
  onChange4(name) {
    for (let i = 0, l = this.level_data.length; i < l; i++) {
      if (this.level_data[i].name == name) {
        if (!this.level_data[i].checked) {
          //
          this.level_data[i].checked = true;
          const email = this.level_data[i].name;
          let test = JSON.stringify({ name: name });
          if ((name || "").trim()) {
            this.lev_data.push({ name: name.trim() });
          }
          if (email == "C-Level") {
            this.levs1.push("1");
          } else if (email == "VP-Level") {
            this.levs1.push("2");
          } else if (email == "Director") {
            this.levs1.push("3");
          } else if (email == "Managers") {
            this.levs1.push("4");
          } else if (email == "Non-Managers") {
            this.levs1.push("5");
          }
          // this.levs1.push(email);
          this.levs.push(test);
        } else {
          //
          if (name == "C-Level") {
            this.seniorityVal = "1";
          } else if (name == "VP-Level") {
            this.seniorityVal = "2";
          } else if (name == "Director") {
            this.seniorityVal = "3";
          } else if (name == "Managers") {
            this.seniorityVal = "4";
          } else if (name == "Non-Managers") {
            this.seniorityVal = "5";
          }
          this.levs1 = this.levs1.filter((a) => a !== this.seniorityVal);
          this.level_data[i].checked = false;
          const name1 = this.level_data[i].name;
          // let ind = { "name": name1 }
          var data1 = [name1];
          let k = this.lev_data.length;
          while (k--) {
            if (data1.indexOf(this.lev_data[k].name) != -1) {
              this.lev_data.splice(k, 1);
            }
          }
        }

        // this.emailFormArray = <FormArray>this.myForm.controls.useremail1;
        // this.SelEmail = this.SelEmail.push(email);
        // this.emailFormArray = this.emailFormArray.push(new FormControl(name));
      }
    }
  }
  onChange5(name) {
    // for (let i = 0, l = this.employee_data.length; i < l; i++) {
    //   if (this.employee_data[i].checked) {
    //     this.employee_data[i].checked = false;

    //   }
    //   if (this.employee_data[i].name == name) {
    //     this.emp_data = [];
    //     if (!this.employee_data[i].checked) {
    //       this.employee_data[i].checked = true;
    //       const email = this.employee_data[i].name
    //       let test = JSON.stringify({ "name": name })
    //       let test1 = { "name": name }
    //       // Add our fruit
    //       if ((name || '').trim()) {
    //         this.emp_data = [];
    //         this.emp1 = [];
    //         this.emp_data.push({ name: name.trim() });
    //       }
    //       const selemp = this.employee_data[i].val
    //       this.emp1.push(selemp);

    //     }

    //   }
    // }
    for (let i = 0, l = this.employee_data.length; i < l; i++) {
      if (this.employee_data[i].name == name) {
        if (!this.employee_data[i].checked) {
          this.employee_data[i].checked = true;
          const email = this.employee_data[i].name;
          if ((name || "").trim()) {
            this.emp_data.push({ name: name.trim() });
          }
          this.emp1.push(email);
        } else {
          this.emp1 = this.emp1.filter((a) => a !== name);
          this.employee_data[i].checked = false;
          const name1 = this.employee_data[i].name;
          let ind = { name: name1 };
          var data1 = [name1];
          let k = this.emp_data.length;
          while (k--) {
            if (data1.indexOf(this.emp_data[k].name) != -1) {
              this.emp_data.splice(k, 1);
            }
          }
        }
      }
    }
  }

  onChange6(name) {
    for (let i = 0, l = this.revenue_data.length; i < l; i++) {
      if (this.revenue_data[i].checked) {
        this.revenue_data[i].checked = false;
      }
      if (this.revenue_data[i].name == name) {
        this.rev_data = [];
        if (!this.revenue_data[i].checked) {
          this.revenue_data[i].checked = true;
          const email = this.revenue_data[i].name;
          let test = JSON.stringify({ name: name });
          let test1 = { name: name };
          // Add our fruit
          if ((name || "").trim()) {
            this.rev_data = [];
            this.revs1 = [];
            this.rev_data.push({ name: name.trim() });
          }
          const selrev = this.revenue_data[i].val;
          this.revs1.push(selrev);
          this.sel_rev_max = this.revenue_data[i].val;
        }
      }
    }
  }

  onChange7(name) {
    for (let i = 0, l = this.location_data.length; i < l; i++) {
      if (this.location_data[i].name == name) {
        if (!this.location_data[i].checked) {
          this.location_data[i].checked = true;
          const email = this.location_data[i].name;
          let test = JSON.stringify({ name: name });
          let test1 = { name: name };
          if ((name || "").trim()) {
            this.loc_data.push({ name: name.trim() });
          }
          // this.ind_data.push({name: email.trim()});
          // this.loc.push(test);
          this.loc1.push(email);
        } else {
          this.loc1 = this.loc1.filter((a) => a !== name);

          this.location_data[i].checked = false;
          const name1 = this.location_data[i].name;
          let ind = { name: name1 };
          var data1 = [name1];
          let k = this.loc_data.length;
          while (k--) {
            if (data1.indexOf(this.loc_data[k].name) != -1) {
              this.loc_data.splice(k, 1);
            }
          }
        }
        // this.emailFormArray = <FormArray>this.myForm.controls.useremail1;
        // this.SelEmail = this.SelEmail.push(email);
        // this.emailFormArray = this.emailFormArray.push(new FormControl(name));
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.ind_data.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  cancelIndustry(ind: Industry_data): void {
    for (let i = 0, l = this.industry_data.length; i < l; i++) {
      if (this.industry_data[i].name == ind.name) {
        if (!this.industry_data[i].checked) {
        } else {
          this.industry_data[i].checked = false;
          this.inds1 = this.inds1.filter((a) => a !== ind.name);
        }
      }
    }
    const index = this.ind_data.indexOf(ind);
    if (index >= 0) {
      this.ind_data.splice(index, 1);
    }
  }

  cancelLocation(ind: Location_data): void {
    for (let i = 0, l = this.location_data.length; i < l; i++) {
      if (this.location_data[i].name == ind.name) {
        if (!this.location_data[i].checked) {
        } else {
          this.location_data[i].checked = false;
          this.loc1 = this.loc1.filter((a) => a !== ind.name);
        }
      }
    }
    const index = this.loc_data.indexOf(ind);

    if (index >= 0) {
      this.loc_data.splice(index, 1);
    }
  }

  cancelDept(ind: Department_data): void {
    for (let i = 0, l = this.deptartment_data.length; i < l; i++) {
      if (this.deptartment_data[i].name == ind.name) {
        if (!this.deptartment_data[i].checked) {
        } else {
          this.deptartment_data[i].checked = false;
          this.dept1 = this.dept1.filter((a) => a !== ind.name);
        }
      }
    }
    const index = this.dept_data.indexOf(ind);

    if (index >= 0) {
      this.dept_data.splice(index, 1);
    }
  }

  cancelSeniority(ind: Lev_data): void {
    for (let i = 0, l = this.level_data.length; i < l; i++) {
      if (this.level_data[i].name == ind.name) {
        if (!this.level_data[i].checked) {
        } else {
          this.level_data[i].checked = false;
          if (ind.name == "C-Level") {
            this.seniorityVal = "1";
          } else if (ind.name == "VP-Level") {
            this.seniorityVal = "2";
          } else if (ind.name == "Director") {
            this.seniorityVal = "3";
          } else if (ind.name == "Managers") {
            this.seniorityVal = "4";
          } else if (ind.name == "Non-Managers") {
            this.seniorityVal = "5";
          }
          this.levs1 = this.levs1.filter((a) => a !== this.seniorityVal);
        }
      }
    }
    const index = this.lev_data.indexOf(ind);

    if (index >= 0) {
      this.lev_data.splice(index, 1);
    }
  }

  cancelEmp(ind: Emp_data): void {
    for (let i = 0, l = this.employee_data.length; i < l; i++) {
      if (this.employee_data[i].name == ind.name) {
        if (!this.employee_data[i].checked) {
        } else {
          this.employee_data[i].checked = false;
          this.emp1 = this.emp1.filter((a) => a !== ind.name);
        }
      }
    }
    const index = this.emp_data.indexOf(ind);

    if (index >= 0) {
      this.emp_data.splice(index, 1);
    }
  }

  cancelRevenue(ind: Revenue_data): void {
    for (let i = 0, l = this.employee_data.length; i < l; i++) {
      if (this.revenue_data[i].name == ind.name) {
        if (!this.revenue_data[i].checked) {
        } else {
          this.revenue_data[i].checked = false;
        }
      }
    }
    const index = this.rev_data.indexOf(ind);

    if (index >= 0) {
      this.rev_data.splice(index, 1);
    }
  }
  onToppingRemoved(topping: string) {
    const toppings = this.inds1.value as string[];
    this.removeFirst(toppings, topping);
    this.inds1.setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  createContactForm() {
    this.contactForm = this.formBuilder.group({
      message: ["", Validators.required],
    });
  }
  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
  }

  final_level: any = [];
  final_level_value: any = [];
  payload: any;
  industryCount: any = [];
  industryName: any = [];
  showError: boolean = false;
  // requestSampletext: boolean = false;
  // requestButton: boolean = true;

  submitData() {
    window.scroll(0, 0);
    if (this.levs1.length > 0) {
      this.progresValue = 100;
      // if (this.levs1.length > 0 && this.emp1.length > 0 || this.loc1.length > 0 || this.inds1.length > 0 || this.dept1.length > 0 ) {
      this.spinner = true;
      this.resultDash = true;
      this.showError = false;
      this.filterSelect = false;
      this.payload = {
        EmployeeRange: this.emp1,
        Location: this.loc1,
        Industry: this.inds1,
        department: this.dept1,
        RevenueMax: this.revs1,
        seniority: this.levs1,
      };
      //
      this.amplizService.getReport(this.payload).subscribe(
        (res) => {
          this.finalreport = res.data;
          //
          this.spinner = false;
          window.scroll(0, 0);

          // Industry Bar Graph Start
          // this.finalreport.company_group_by_industry.forEach(e => {
          //   let count = e.counts;
          //   let names = e.Industry;
          //   this.industryName.push(names);
          //   this.industryCount.push(count);
          // });
          // Industry Bar Graph End

          // Industry Bar Graph Start
          // this.indChartOptions= {
          //   series: [
          //     {

          //       data: this.industryCount
          //     }
          //   ],
          //   chart: {
          //     type: "bar",
          //     height: 'auto',
          //     toolbar: {
          //       show: true,
          //       tools: {
          //         download: false
          //       }
          //     }
          //   },
          //   plotOptions: {
          //     bar: {
          //       horizontal: true,
          //     }
          //   },
          //   xaxis: {
          //     categories: this.industryName
          //   },

          // };
          // Industry Bar Graph End

          for (
            let i = 0, l = this.finalreport.contact_group_by_level.length;
            i < l;
            i++
          ) {
            // if (this.finalreport.contact_group_by_level[i].LevelID == 6) {
            //   final_level.push("Other")
            //   final_level_value.push(this.finalreport.contact_group_by_level[i].counts)
            // }
            if (this.finalreport.contact_group_by_level[i].LevelID == 5) {
              this.final_level.push("Staff");
              this.final_level_value.push(
                this.finalreport.contact_group_by_level[i].counts
              );
            } else if (
              this.finalreport.contact_group_by_level[i].LevelID == 4
            ) {
              this.final_level.push("Manager");
              this.final_level_value.push(
                this.finalreport.contact_group_by_level[i].counts
              );
            } else if (
              this.finalreport.contact_group_by_level[i].LevelID == 3
            ) {
              this.final_level.push("Director");
              this.final_level_value.push(
                this.finalreport.contact_group_by_level[i].counts
              );
            } else if (
              this.finalreport.contact_group_by_level[i].LevelID == 2
            ) {
              this.final_level.push("VP-Level");
              this.final_level_value.push(
                this.finalreport.contact_group_by_level[i].counts
              );
            } else if (
              this.finalreport.contact_group_by_level[i].LevelID == 1
            ) {
              this.final_level.push("C Level");
              this.final_level_value.push(
                this.finalreport.contact_group_by_level[i].counts
              );
            } else {
              // final_level.push("Non-Manager")
              // final_level_value.push(this.finalreport.contact_group_by_level[i].counts)
            }
          }
          this.chartOptions = {
            series: this.final_level_value,
            chart: {
              type: "donut",
            },
            labels: this.final_level,
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          };
          this.finalreport.company_group_by_location.forEach((e) => {
            let values = [e.coun_short, e.counts];
            this.hTLocations.push(values);
            //
          });

          // let mapdatajson: any = worldMap.features;
          // mapdatajson.filter(ele => {
          //   if(ele.id.toLowerCase() !== this.hTLocations){
          //   let val = [ele.id.toLowerCase(), 0];
          //   this.hTLocations.push(val);
          //   this.finalmap = [...new Set(this.hTLocations)];
          //   }
          // });

          this.chartOption = {
            chart: {
              map: worldMap as any,
            },
            title: {
              text: "",
            },
            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: "bottom",
              },
            },
            colorAxis: {
              minColor: "#dce3ff",
              maxColor: "#007bff",
              min: 0,
            },
            credits: {
              enabled: false,
            },
            series: [
              {
                states: {
                  hover: {
                    color: "#BADA55",
                  },
                },
                dataLabels: {
                  enabled: true,
                  format: "{point.name}",
                },
                tooltip: {
                  headerFormat: "",
                },
                data: this.hTLocations,
              },
            ],
          };
        },
        (error) => {
          //
        }
      );
      // }
    } else {
      this.showError = true;
    }
  }
  senioritname: any = [];
  icpFilterDataRequest() {
    this.lev_data.forEach((e) => {
      this.senioritname.push(e.name);
    });
    let selectedFilter = {
      industry: this.inds1,
      employee: this.emp1,
      email: this.email_id,
      location: this.loc1,
      department: this.dept1,
      seniority: this.senioritname,
    };
    //
    this.amplizService.icpSelectedFiltersSave(selectedFilter).subscribe(
      (res) => {
        // this.requestButton = false;
        // this.requestSampletext = true;
        //
        if (res.msg && res.msg_type == 1) {
          this.router.navigate(["/requesthifi", "dataRequest"]);
        }
      },
      (err) => {
        //
      }
    );
  }

  refineFilters() {
    this.resultDash = false;
    this.filterSelect = true;
    this.final_level = [];
    this.final_level_value = [];
    this.levs1 = [];
    this.dept1 = [];
    this.inds1 = [];
    this.emp1 = [];
    this.loc1 = [];
    this.hTLocations = [];
    if (this.filterSelect == true) {
      this.ind_data = [];
      this.dept_data = [];
      this.lev_data = [];
      this.emp_data = [];
      this.loc_data = [];
      // this.rev_data = [];
    }
    this.location = true;
    this.remainStep = "4";
    this.progresValue = 0;
    this.level = false;
    this.finalreport = {};
    for (let i = 0, l = this.industry_data.length; i < l; i++) {
      this.industry_data[i].checked = false;
    }
    for (let i = 0, l = this.deptartment_data.length; i < l; i++) {
      this.deptartment_data[i].checked = false;
    }
    for (let i = 0, l = this.location_data.length; i < l; i++) {
      this.location_data[i].checked = false;
    }
    for (let i = 0, l = this.level_data.length; i < l; i++) {
      this.level_data[i].checked = false;
    }
    for (let i = 0, l = this.employee_data.length; i < l; i++) {
      this.employee_data[i].checked = false;
    }
  }
  getDataAccess() {
    this.lev_data.forEach((e) => {
      this.senioritname.push(e.name);
    });
    let selectedFilter = {
      industry: this.inds1,
      employee: this.emp1,
      email: this.email_id,
      location: this.loc1,
      department: this.dept1,
      seniority: this.senioritname,
    };
    //
    this.amplizService.icpDataAccessReq(selectedFilter).subscribe(
      (res) => {
        //
        if (res.msg && res.msg_type == 1) {
          this.router.navigate(["/requesthifi", "getDataAccess"]);
        }
      },
      (err) => {
        //
      }
    );
  }
}
