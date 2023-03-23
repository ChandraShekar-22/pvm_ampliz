import { Component, OnInit, Input } from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
// import * as XLSX from 'xlsx';

@Component({
  selector: "app-domainsearch",
  templateUrl: "./domainsearch.component.html",
  styleUrls: ["./domainsearch.component.css"],
})
export class DomainsearchComponent implements OnInit {
  // emailordomain: string;
  response: any;
  showcontact = false;
  showCompany = false;
  showMsg: boolean = false;
  subscribed: boolean;
  subscriptions = [];
  noData: boolean = false;
  // invalidurl:boolean =false;
  public user = null;
  // @Input()
  // location: string;
  tryUrlBtn = [{ name: "microsoft.com" }, { name: "intercom.com" }];
  spinner: boolean = false;
  submitted = false;
  static = true;
  public headerData;
  domainForm: UntypedFormGroup;
  successMsg: boolean = false;
  companyId: any;

  constructor(
    private amplizService: AmplizService,
    private cookieService: CookieService,
    private formBuilder: UntypedFormBuilder
  ) {
    const reg =
      "(https?://)?(www.)?([\\da-zA-Z.-]+){3}\\.([a-z.]{2,6})[/\\w .-]*/?";

    // const reg= /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/
    // const reg = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    //  const reg =  /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    this.domainForm = this.formBuilder.group({
      url: ["", Validators.pattern(reg)],
    });
  }

  ngOnInit() {
    this.getDashboardDetails();
  }

  get f() {
    return this.domainForm.controls;
  }

  keySearch($event) {
    // this.invalidurl = false;
    this.noData = false;
  }

  domainSearch(fd) {
    this.submitted = true;
    // this.invalidurl= false;
    if (fd.url == "") {
      this.showMsg = true;
      return;
    } else {
      this.showMsg = false;
    }
    if (this.domainForm.invalid) {
      return;
    }
    if (fd.url) {
      if (
        fd.url.slice(0, 7) === "http://" ||
        fd.url.slice(0, 7) === "Http://" ||
        fd.url.slice(0, 7) === "HTTP://"
      ) {
        fd.url = fd.url.substring(7);
      } else if (
        fd.url.slice(0, 8) === "https://" ||
        fd.url.slice(0, 8) === "Https://" ||
        fd.url.slice(0, 8) === "HTTPS://"
      ) {
        fd.url = fd.url.substring(8);
      }
      // if(fd.url.slice(-6) == ".co.in" && fd.url.slice(0,4) != "www." ){
      //   let str = "www.";
      //   fd.url = str.concat(fd.url);
      // }
      if (fd.url.slice(0, 3) === "www" || fd.url.slice(0, 3) === "WWW") {
        fd.url = fd.url;
      } else {
        let str = "www.";
        fd.url = str.concat(fd.url);
      }
      if (fd.url.slice(-1) === "/") {
        fd.url = fd.url.slice(0, -1);
      }
      //
      this.spinner = true;
      this.static = false;
      this.showCompany = false;
      this.noData = false;
      this.showSuccessMsg = false;
      this.amplizService.domainSearch(fd.url.toLowerCase()).subscribe(
        (res) => {
          this.static = false;
          //
          if (res.msg_type == 1) {
            this.companyId = res.data[0].CompanyID;
            // this.domainForm.reset();
            this.showCompany = true;
            this.spinner = false;
            this.response = res.data[0];
          } else {
            // this.invalidurl=true;
            this.noData = true;
            this.spinner = false;
            this.successMsg = false;
          }
          // if (res.msg_type == 1 && Object.keys(res.data.company).length > 0) {
          //     this.showCompany = true;
          //     this.response = res.data.company;
          //
          //     // this.emailordomain ="";
          // } else {
          //   this.static = false;
          //   this.showcontact = false;
          //   this.showCompany = false;
          //   this.noData = true;
          // }
        },
        (err) => {
          this.noData = true;
          this.spinner = false;
          this.successMsg = false;
          //
        }
      );
    }
  }

  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    const refreshToken = await localStorage.getItem("refresh_token");
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          //
          this.subscriptions = res.Subscriptions;
          //
          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            this.headerData = "Upgrade";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
        }
      );
    } else {
      this.amplizService.logout();
    }
  }

  showCompInfo(value) {
    this.domainForm.reset();
    this.domainForm.value.url = value;
    this.domainSearch(this.domainForm.value);
  }

  scroll($element): void {
    //
    $element.scrollIntoView({ behavior: "smooth" });
  }

  async requestCompany() {
    let id = 0;
    this.amplizService
      .requestCompany(id, this.domainForm.value.url, "Requested Company")
      .subscribe(
        (res) => {
          //
          if (res.msg_type === 1) {
            this.successMsg = true;
            // this.noData= true;
          }
        },
        (err) => {
          //
          this.successMsg = true;
        }
      );
  }

  // onFileChange(ev) {
  //   let workBook = null;
  //   let jsonData = null;
  //   const reader = new FileReader();
  //   const file = ev.target.files[0];
  //   reader.onload = (event) => {
  //     const data = reader.result;
  //     workBook = XLSX.read(data, { type: 'binary' });
  //     jsonData = workBook.SheetNames.reduce((initial, name) => {
  //       const sheet = workBook.Sheets[name];
  //       initial[name] = XLSX.utils.sheet_to_json(sheet);
  //       return initial;
  //     }, {});
  //     const dataString = JSON.stringify(jsonData);
  //
  //     // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
  //   }
  //   reader.readAsBinaryString(file);
  // }
  successReqMsg = "";

  showSuccessMsg = false;
  async requestData() {
    this.amplizService
      .requestCompany(
        this.companyId,
        this.domainForm.value.url,
        "Requested Contacts"
      )
      .subscribe(
        (res) => {
          // this.successMessage.display(true, res.msg);
          //
          if (res.msg_type == 1) {
            this.showSuccessMsg = true;
          }
        },
        (error) => {
          //
        }
      );
  }
}
