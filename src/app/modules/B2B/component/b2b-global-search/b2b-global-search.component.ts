import { Component, OnInit } from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { B2bService } from "../../services/b2b.service";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from "@angular/common/http";

@Component({
  selector: 'app-b2b-global-search',
  templateUrl: './b2b-global-search.component.html',
  styleUrls: ['./b2b-global-search.component.css']
})
export class B2bGlobalSearchComponent implements OnInit {
  letSearch: boolean = false;
  searchState = {
    companyList: [],
    contactList: [],
  };
  searchVal: string = '';
  modelState: boolean = false;
  showSearch: boolean = false;
  clientIp = '';
  constructor(
    private router: Router,
    private http: HttpClient,
    private _B2BsearchData: B2bService,
    private amplizService: AmplizService
  ) {
    let url = this.router.url;
    this.letSearch = true;
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
  //   this.amplizService.getIpAddress().subscribe(res => {
  //     this.clientIp = res.ip||'';
  //   },(err: any) => {
      
  //   });
  //   // var that = this;
  //   // var xmlHttp = new XMLHttpRequest();
  //   // xmlHttp.onload = function (res) {
  //   //   that.clientIp = JSON.parse(xmlHttp.responseText).ip;
  //   // };
  //   // xmlHttp.open("GET", "https://api.ipify.org?format=json", false);
  //   // xmlHttp.send(null);
  // }

  getB2BSearchData(val) {
    let value = val;
    this.searchVal = val;
    let params = { seachPhrase: value,
      // clientIp: this.clientIp
    };
    if (this.searchVal.length > 2) {
      this._B2BsearchData
      .getB2BSearchData(params)
      .pipe(debounceTime(1000))
      .subscribe((data) => {
        const { summarySearch = {} } = data;
        this.modelState = true;
        this.searchState = summarySearch;
        // console.log('result -> ', this.searchState)
      });
    } else if(this.searchVal.length == 0) {
      this.searchState = {
        companyList: [],
        contactList: [],
      }; 
    }
  }

  outsideClickHandler() {
    this.searchVal = "";
    this.modelState = false;
  }

  // searchClickHandler(page, id) {
  //   this.router.navigate([`/${page}/`, { id }]);
  //   this.searchVal = "";
  //   this.modelState = false;
  // }



}
