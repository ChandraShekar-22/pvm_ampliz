import { Component, OnInit, Input, NgZone, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { AmplizService } from "../../../healthcare/services/ampliz.service";
import { LoaderService } from "../../../healthcare/services/loader.service";
import { SuccessmessageService } from "../../../healthcare/services/successmessage.service";
import { ErrorService } from "../../../healthcare/services/error.service";
import { CookieService } from "ngx-cookie-service";
import { DataService } from "../../../healthcare/services/data.service";
import { Subscription } from "rxjs-compat";
import { MessageService } from "../../../B2B/services/message.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() dashboard: boolean;
  // @Input() user: any;
  @Input() subscriptionStatus: any;
  @Input("header-data") data;
  @Input("user") user: any;
  @Input("chromestatus") chrome_button;
  public headerData;
  isSpecialityUser: boolean = false;
  subscribed: boolean = false;
  showLoader: boolean = false;
  showBtn: boolean = false;
  showChrmBtn: boolean;
  showSuccessMesssage = true;
  username = "Name";
  hasNoExtension = false;
  // chrome_button = "";
  button = "";
  access_token = "";
  refresh_token = "";
  data_set="";
  CurrentCredits = "";
  isPersonaSet = "";
  showError = false;
  @Input() elementName = "dashboard";
  constructor(
    public router: Router,
    private amplizService: AmplizService,
    private loaderService: LoaderService,
    private successMessage: SuccessmessageService,
    private errorService: ErrorService,
    private ngZone: NgZone,
    private cookieService: CookieService,
    private healthCareDataService: DataService,
    private messageService: MessageService
  ) {
    // this.router = router;
  }
  get dataSet() {
    return window.localStorage.getItem("Dataset");
  }
  ngOnInit() {
    // console.log(this.router,"Router is .......");
  }

  ngAfterViewInit() {
    this.access_token = this.cookieService.get("auth_token");
    this.refresh_token = this.cookieService.get("refresh_token");
    this.username = this.cookieService.get("username");
    this.CurrentCredits = this.cookieService.get("credits");
    this.isPersonaSet = this.cookieService.get("isPersonaSet");
    this.data_set = this.cookieService.get("Dataset");
    if (this.access_token != "") {
      localStorage.setItem("Dataset", this.data_set);
    }
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
    setTimeout(() => {
      this.isSpecialityUser =
        localStorage.getItem("is_SpecialityUser") == "true" ? true : false;
      // console.log(this.isSpecialityUser, "this.isSpecialityUser");
    }, 10);

    this.getDashboardDetails();
    // this.checkChromeExtenstion();

    setTimeout(() => {
      this.loaderService.status.subscribe((res) => {
        this.showLoader = res;
      });
      this.successMessage.statusActive.subscribe((res) => {
        this.showSuccessMesssage = res;
      });
      this.errorService.statusActive.subscribe((res) => {
        this.showError = res;
      });
      this.user = localStorage.getItem("username");
    });

    //this.username = localStorage.getItem('username');
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");

    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.checkSubscriptionStatus().subscribe(
        (res) => {
          //
          if (res[0].Subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            // this.button = "Request Pricing";
            // this.data = "Request Pricing";
          }
          if (res[0].Subscriptions[0].SubscriptionType == "Paid") {
            localStorage.setItem("SubscriptionisActive", "true");
            this.button = "button";
            this.subscribed = false;
          }
          this.subscriptionStatus = localStorage.getItem(
            "SubscriptionisActive"
          );

          if (this.subscriptionStatus == "false") {
            if (this.dataSet != "B2B") {
              this.button = "Request Pricing";
              this.data = "Request Pricing";
              this.showBtn = true;
            } else {
              this.button = "Upgrade";
              this.data = "Upgrade";
              this.showBtn = true;
            }
          }
          if (this.subscriptionStatus == "true") {
            this.button = "";
            this.data = "";
            this.showBtn = false;
          }
          // if (this.isSpecialityUser == true) {
          //   this.button = "Request";
          //   this.data = "Request";
          //   this.showBtn = true;
          // }
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
    // console.log(this.isSpecialityUser, "speciality user");

    // if (this.isSpecialityUser == true) {
    //   this.button = "Request";
    //   this.data = "Request";
    //   this.showBtn = true;
    // }
  }
  // getUserName(){
  //  // this.username = localStorage.getItem('username');
  // this.user = localStorage.getItem('username');
  // this.subscriptionStatus = localStorage.getItem('SubscriptionisActive')

  // }
  // openItem() {
  //   if (this.dashboard) {
  //     this.router.navigate(['favourite']);
  //   } else {
  //     this.router.navigate(['dashboard']);
  //   }
  // }

  logout() {
    this.amplizService.logout();
  }
  editprofile() {}
  toggleSideMenu() {
    let el: HTMLElement = document.getElementsByTagName("body")[0];
    if (el.classList["0"] === "enlarged") {
      el.classList.remove("enlarged");
    } else {
      el.classList.add("enlarged");
    }
  }
  navigatePage(item) {
    this.elementName = item;
    if (item === "editprofile") {
      this.router.navigate(["editprofile"]);
    }
  }
  public openItem(path: string): void {
    let urlPath = path;
    if (path == "B2B") {
      urlPath = "payment";
    } else if (path == "healthcare") {
      urlPath = "hcpayment";
    }
    // else if (this.isSpecialityUser == true) {
    //   urlPath = "hcupgrade";
    // }
    this.ngZone.run(() => this.router.navigateByUrl(urlPath)).then();
  }
  // public requestSearch() {
  //   const subscriber: Subscription =  this.healthCareDataService.physicianSearch.subscribe((data: any) => {
  //     console.log(data, "data request");
  //     // if (
  //     //   data.physicianSearchParams.specialityIncluded &&
  //     //   data.physicianSearchParams.specialityIncluded.length > 0
  //     // ) {

  //       if(this.router.url=='/executive') {
  //         this.amplizService.requestSpecialitySearchEx({executiveSearchParams:data}).subscribe((res: any) => {
  //           this.successMessage.display(true, res.msgInfo.msg);
  //           console.log(res);
  //         });
  //       } else {
  //         this.amplizService.requestSpecialitySearch({physicianSearchParams:data}).subscribe((res: any) => {
  //           this.successMessage.display(true, res.msgInfo.msg);
  //           console.log(res);
  //         });
  //       }

  //     // }
  //   });
  //   subscriber.unsubscribe();
  // }
  async requestPricing() {
    console.log("EMAIL ID", localStorage.getItem("email_id"))
    const emailId = await localStorage.getItem("email_id");
    console.log("AFTER AWAIT", emailId);
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
}
