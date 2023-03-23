import { Component, OnInit } from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-apac-companies",
  templateUrl: "./apac-companies.component.html",
  styleUrls: ["./apac-companies.component.css"],
})
export class ApacCompaniesComponent implements OnInit {
  submitted = false;
  apacForm: UntypedFormGroup;
  showMsg: boolean = false;
  spinner: boolean = false;
  static = true;
  noData: boolean = false;
  successMsg: boolean = false;
  showCompany = false;
  response: any;
  showcontact = false;
  public user = null;
  subscriptions = [];
  subscribed: boolean;
  public headerData;

  tryUrlBtn = [{ name: "infosys.com" }, { name: "indusind.com" }];

  constructor(
    private amplizService: AmplizService,
    private cookieService: CookieService,
    private formBuilder: UntypedFormBuilder
  ) {
    const reg =
      "(https?://)?(www.)?([\\da-zA-Z.-]+){3}\\.([a-z.]{2,6})[/\\w .-]*/?";

    this.apacForm = this.formBuilder.group({
      url: ["", Validators.pattern(reg)],
    });
  }

  ngOnInit() {
    this.getDashboardDetails();
  }

  get f() {
    return this.apacForm.controls;
  }

  keySearch($event) {
    // this.invalidurl = false;
    this.noData = false;
  }

  apacCompany(fd) {
    this.submitted = true;
    // this.invalidurl= false;
    if (fd.url == "") {
      this.showMsg = true;
      return;
    } else {
      this.showMsg = false;
    }
    if (this.apacForm.invalid) {
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
      this.amplizService.apacCompany(fd.url.toLowerCase()).subscribe(
        (res) => {
          this.static = false;
          //
          if (res.msg_type == 1) {
            this.apacForm.reset();
            this.showCompany = true;
            this.spinner = false;
            this.response = res.data[0];
            //
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
          this.subscriptions = res.dashoboardInfo.subscriptions;
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
    this.apacForm.reset();
    this.apacForm.value.url = value;
    this.apacCompany(this.apacForm.value);
  }
  async requestCompany() {
    let id = 0;
    this.amplizService
      .requestCompany(id, this.apacForm.value.url, "Requested Company")
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
}
