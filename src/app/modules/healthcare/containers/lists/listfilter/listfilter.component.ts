import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import moment from "moment";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-listfilter",
  templateUrl: "./listfilter.component.html",
  styleUrls: ["./listfilter.component.css"],
})
export class ListfilterComponent implements OnInit {
  @Output()
  applyBtnClick: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  cancelBtnClick: EventEmitter<any> = new EventEmitter<any>();
  showLeadLocation: boolean = false;
  showHospitalLocation: boolean = false;
  searchLeadFilter: any = {};
  dateRange: any;
  stateList: any = [];
  cityListState: any = [];
  cityListHospital: any = [];
  listId: any = "";
  leadState: any = [];
  leadCity: any = [];
  hospitalState: any = [];
  hospitalCity: any = [];
  selecteLeadStateName: any;
  selectedLeadCityName: any;
  selecteLeadHospitalName: any;
  selectedHospitalCityName: any;
  selectedItems = [];
  selectedHospitalItems = [];
  stateListSettings = {};
  cityListSettings: {};
  leadCityArr = [];
  hospitalCityArr = [];
  cityListStateHospital: any = [];
  constructor(
    public amplizService: AmplizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.listId = res.listId;
    });
    this.getAllState();
    this.stateListSettings = {
      singleSelection: false,
      idField: "stateId",
      textField: "state",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll: false,
    };

    this.cityListSettings = {
      singleSelection: false,
      idField: "city",
      textField: "city",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll: false,
    };
  }

  onStateSelect(ev: any) {
    //
    this.selectedItems.push(ev);

    this.loadCityList(ev.stateId);
  }

  OnStateDeSelect(ev: any) {
    var ind = this.selectedItems.findIndex((el) => el.id == ev.stateId);

    this.selectedItems.splice(ind, 1);

    this.leadCityArr = this.leadCityArr.filter(
      (el) => el.stateId !== ev.stateId
    );
    this.searchLeadFilter.leadState = this.selectedItems;
    this.leadState = this.selectedItems;
  }

  onStateSelectHospital(ev: any) {
    this.selectedHospitalItems.push(ev);

    this.loadHospitalCityList(ev.stateId);
  }

  OnStateDeSelectHospital(ev: any) {
    var ind = this.selectedHospitalItems.findIndex((el) => el.id == ev.stateId);

    this.selectedHospitalItems.splice(ind, 1);

    this.hospitalCityArr = this.hospitalCityArr.filter(
      (el) => el.stateId !== ev.stateId
    );
  }

  toggleLeadLocation() {
    this.showLeadLocation = !this.showLeadLocation;
  }
  toggleHospitalLocation() {
    this.showHospitalLocation = !this.showHospitalLocation;
  }

  cancelFilter() {
    this.searchLeadFilter = {};
    this.leadState = [];
    this.leadCity = [];
    this.hospitalCity = [];
    this.hospitalState = [];
    this.cancelBtnClick.emit(false);
    this.dateRange = "";
  }
  applyLeadFilter() {
    //
    // this.dateRange = new Date();
    this.searchLeadFilter.offset = 0;
    this.searchLeadFilter.count = 4;
    this.searchLeadFilter.listId = this.listId;
    if (this.leadState.length > 0) {
      var re = /\((.*)\)/;
      this.searchLeadFilter.leadState = this.leadState.map(
        (a) => a.state.match(re)[1]
      );
    }
    if (this.leadCity.length > 0) {
      this.searchLeadFilter.leadCity = this.leadCity.map((b) => b.city);
    }

    if (this.hospitalState.length > 0) {
      this.searchLeadFilter.hospitalState = this.hospitalState.map(
        (a) => a.state.match(re)[1]
      );
    }
    if (this.hospitalCity.length > 0) {
      this.searchLeadFilter.hospitalCity = this.hospitalCity.map((a) => a.city);
    }

    if (this.searchLeadFilter.hospitalName === "") {
      delete this.searchLeadFilter.hospitalName;
    }

    if (this.dateRange && this.dateRange.addedStartDate !== null) {
      // if(this.searchLeadFilter.addedStartDate && this.searchLeadFilter.addedEndDate) {
      this.searchLeadFilter.addedStartDate = moment(
        this.dateRange.addedStartDate.toDate()
      ).format("YYYY-MM-DD");
      this.searchLeadFilter.addedEndDate = moment(
        this.dateRange.addedEndDate.toDate()
      ).format("YYYY-MM-DD");
      // }
    }

    this.applyBtnClick.emit(this.searchLeadFilter);
  }

  getAllState() {
    this.amplizService.getAllState().subscribe((state: any) => {
      this.stateList = state.stateDataList;
      this.stateList = this.stateList.map((el) => {
        return {
          stateId: el.stateId,
          state: el.stateFullName + " (" + el.state + ")",
        };
      });
    });
  }

  loadCityList(ev: any) {
    this.amplizService.getCityListForState(ev).subscribe((city) => {
      this.cityListState = city.cityDataList;
      //
      this.leadCityArr = [...this.leadCityArr, ...city.cityDataList];
    });
  }

  loadHospitalCityList(ev: any) {
    this.amplizService.getCityListForState(ev).subscribe((city) => {
      this.cityListStateHospital = city.cityDataList;
      //
      this.hospitalCityArr = [...this.hospitalCityArr, ...city.cityDataList];
    });
  }

  // AutoloadCity(ev: any) {
  //   this.selectedLeadCityName = ev.target.options[ev.target.options.selectedIndex].text;
  //   //
  //   this.searchLeadFilter.leadCity = this.selectedLeadCityName;
  // }

  // AutoloadHospitalCity(ev: any) {
  //   this.selectedHospitalCityName = ev.target.options[ev.target.options.selectedIndex].text;
  //   this.searchLeadFilter.hospitalCity = this.selectedHospitalCityName;
  // }

  // loadHospitalCityList(ev: any) {
  //   this.selecteLeadHospitalName = ev.target.options[ev.target.options.selectedIndex].text;
  //   this.searchLeadFilter.hospitalState = this.selecteLeadHospitalName;
  //   this.amplizService.getCityListForState(this.hospitalState).subscribe(city=> {
  //     this.cityListHospital = city.cityDataList;
  //   })
  // }

  onCitySelect(ev: any) {
    //
  }

  onCityDeSelect(ev: any) {}
  onCitySelectHospital(ev: any) {
    //
  }

  onCityDeSelectHospital(ev: any) {}
}
