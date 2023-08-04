import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Subscriber, Subscription } from "rxjs";
import { B2bService } from "src/app/modules/B2B/services/b2b.service";
import { FilterStorageService } from "src/app/modules/B2B/services/filter-storage.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { SearchImagingModel } from "../../../ImagingCenter/models/SearchImagingModel";
import { ImagingDataService } from "../../../ImagingCenter/services/imaging-data.service";
import { ImagingService } from "../../../ImagingCenter/services/imaging.service";
import { SearchPayourModel } from "../../models/search-payor-model.model";
import { PayorService } from "../../service/payor.service";

@Component({
  selector: "app-payor-filter",
  templateUrl: "./payor-filter.component.html",
  styleUrls: ["./payor-filter.component.css"],
})
export class PayorFilterComponent implements OnInit, OnDestroy {
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() isSubscribed: boolean = false;
  @Input() isPaid: boolean = false;
  filterData: SearchPayourModel = new SearchPayourModel();
  //company Variables
  companyList: Array<any> = [];

  //Country Variables
  countryList: Array<any> = [];
  selectedCountry: Array<any> = [];

  //State Variables
  stateList: Array<any> = [];
  selectedStates: Array<any> = [];

  //City Variables

  //Search List variables
  cityList: Array<any> = [];
  selectedCities: Array<any> = [];

  // Revenue Variables
  revenueList: Array<any> = [];
  includedRevenueRange: any = [];
  subscription: Subscription;
  mapingValue = {
    "Payors/health Insurance": 0,
    "Preferred Provider Organization": 1,
    "Point Of Service": 2,
    "Exclusive Provider Organization": 3,
    "Health Maintenance Organization": 4,
  };

  //Imaging equipments

  numberOfImagingEquipmentList: string[] = [];

  constructor(
    private b2bService: ImagingService,
    private filterStorageService: FilterStorageService,
    private dataService: ImagingDataService,
    private payourService: PayorService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private amplizService: AmplizService
  ) {}

  ngOnInit() {
    this.getPersistData();
    this.makeImagingEqipmentList();
    // this.subscription = this.dataService.imagingSearchData.subscribe((res) => {
    //   if (res.fromSearch) {
    //     this.filterData=res.data;
    //     this.omitChanges();
    //   }
    // });
  }

  makeImagingEqipmentList() {
    // this.numberOfImagingEquipmentList = [];
    // for(let i=0;i<25;i++) {
    //   this.numberOfImagingEquipmentList.push(i+1);
    // }
    this.numberOfImagingEquipmentList = [
      "Payors/health Insurance",
      "Preferred Provider Organization",
      "Point Of Service",
      "Exclusive Provider Organization",
      "Health Maintenance Organization",
    ];
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    // this.dataService.passSearchImagingInput(this.filterData, false);
  }
  ngOnChanges() {
    this.isPaid = !this.isSubscribed;
    // this.isPaid = false;
    //
  }

  companyValueChanges(item) {
    if (item && item.length > 1) {
      this.payourService.getCompanyList(item).subscribe((res) => {
        this.companyList = res.companyListMCO;
      });
    }
  }
  getPersistData() {
    // let that = this;
    setTimeout(() => {
      this.filterData.centerName =
        this.filterStorageService.get("payour_centerName") || [];

      this.filterData.stateList =
        this.filterStorageService.get("payour_selectedStates") || [];
      this.filterData.cityList =
        this.filterStorageService.get("payour_selectedCities") || [];
      this.selectedCountry =
        this.filterStorageService.get("payour_selectedCountry") || [];
      this.filterData.industry =
        this.filterStorageService.get("payour_industry") || "";
      // setTimeout(() => {
      this.omitChanges();
    });
  }
  async requestPricing() {
    const emailId = await localStorage.getItem("email_id");
    this.loaderService.display(true);
    const body = { package: "Enterprise", email: emailId };
    this.amplizService.getPrice(body).subscribe(
      (res) => {
        this.loaderService.display(false);

        this.messageService.display(
          true,
          "Thanks for asking, will get back to you in 24 hrs"
        );
      },
      (error) => {
        this.loaderService.display(false);
        this.messageService.displayError(
          true,
          error.error.msg ? error.error.msg : "Server Error !!!"
        );
      }
    );
  }

  storeFilterData() {
    this.filterStorageService.set(
      "payour_centerName",
      this.filterData.centerName
    );

    this.filterStorageService.set(
      "payour_selectedStates",
      this.filterData.stateList
    );
    this.filterStorageService.set(
      "payour_selectedCities",
      this.filterData.cityList
    );

    this.filterStorageService.setNumberOrString(
      "payour_industry",
      this.filterData.industry
    );
  }

  omitChanges() {
    this.onFilterChange.emit(this.filterData);
    this.storeFilterData();
  }

  clearFilter() {
    const isValid = this.filterData.validateImagingSearch();
    if (isValid) {
      this.filterData = new SearchPayourModel();
      this.omitChanges();
    }
  }
  hanldeLocationValueChange(locationBody: any) {
    this.filterData.cityList = locationBody.city.map((item) => item.city);
    this.filterData.stateList = locationBody.state.map((item) => item.state);
    this.omitChanges();
  }
}
