import { Component, OnInit } from "@angular/core";
import { AmplizService } from "../../../healthcare/services/ampliz.service";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from "@angular/common/http";
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  searchState = {
    healthExecuticeList: [],
    hospitalList: [],
    physicianList: [],
    savedList: [],
  };
  searchVal: string = "";
  modelState: boolean = false;
  showSearch: boolean = false;
  clientIp = "";
  constructor(
    private _searchData: AmplizService,
    private router: Router,
    private http: HttpClient,
    private amplizService:AmplizService
  ) {
    let url = this.router.url;
    // this.showSearch = url !== '/dashboard'
    this.showSearch = true;
  }

  ngOnInit() {
    // this.getIPAddress();
  }

  hideModel(event) {
    event.stopPropagation();
    this.searchVal = "";
    this.modelState = false;
  }
  // getIPAddress() {
  //   // this.amplizService.getIpAddress().subscribe(res => {
  //   //   console.log(res);
  //   //   this.clientIp = res.ip||'';
  //   // },(err: any) => {
      
  //   // });
  // }
  getSearchData(val) {
    //let value = event.target.value;
    let value = val;
    this.searchVal = val;
    let params = { seachPhrase: value,
      // clientIp: this.clientIp
    };
    if (this.searchVal.length > 2) {
      this._searchData
        .getSearchData(params)
        .pipe(debounceTime(1000))
        .subscribe((data) => {
          const { summarySearch = {} } = data;
          this.modelState = true;
          this.searchState = summarySearch;
        });
    }
  }

  searchClickHandler(page, id) {
    this.router.navigate([`/${page}/`, { id }]);
    this.searchVal = "";
    this.modelState = false;
  }

  outsideClickHandler() {
    this.searchVal = "";
    this.modelState = false;
  }
}
