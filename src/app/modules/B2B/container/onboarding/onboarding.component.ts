import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AmplizService } from "../../../healthcare/services/ampliz.service";
import { DataService as B2BService } from "../../../B2B/services/data.service";

declare var Calendly;
@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.css"],
})
export class OnboardingComponent implements OnInit {
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("youtube_iframe", { static: true }) youtube_iframe: ElementRef;
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private amplizService: AmplizService,
    private b2bService: B2BService
  ) {}
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
  dataSet = "";
  public user = null;
  showChrmBtn: boolean;
  public headerData;
  hasExtension: boolean = true;
  subscribed: boolean;
  ngOnInit() {
    this.access_token = this.cookieService.get("auth_token");
    this.refresh_token = this.cookieService.get("refresh_token");
    this.username = localStorage.getItem("username");
    this.CurrentCredits = this.cookieService.get("credits");
    this.isPersonaSet = this.cookieService.get("isPersonaSet");
    this.dataSet = this.cookieService.get("Dataset");
    if (this.access_token != "") {
      localStorage.setItem("Dataset", this.dataSet);
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

    this.getDashboardDetails();

    // Calendly.initInlineWidget({
    //   url: 'https://calendly.com/ampliz/productdemo?hide_event_type_details=1',
    //   parentElement: this.container.nativeElement
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
          this.subscriptions = res.dashoboardInfo.subscriptions;
          //
          this.creditsremaining =
            res.dashoboardInfo.subscriptions[0].SubscriptionCredits;
          //
          if (res.Subscriptions[0].SubscriptionName == "Subscription1") {
            localStorage.setItem("plan", "Basic");
          } else {
            localStorage.setItem(
              "plan",
              res.dashoboardInfo.subscriptions[0].SubscriptionName
            );
          }
          if (res.dashoboardInfo.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Upgrade";
          }
          if (res.dashoboardInfo.subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
            this.button = "button";
          }
          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Upgrade";

            this.button = "Upgrade";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
            this.button = "button";
          }
          this.currentCredit =
            this.creditsremaining - res.dashoboardInfo.CurrentCredits;
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
  openDashboard() {
    this.router.navigate(["dashboard"]);
  }

  changeTabToCompany() {
    this.b2bService.changeSelectedTab(1);
    this.router.navigate(["/b2b"]);
  }
  // closemodal(){
  //   this.youtube_iframe.nativeElement.setAttribute('src','');
  //   // callPlayer('yt-player', 'stopVideo');
  // }
  // openmodal(){
  //   this.youtube_iframe.nativeElement.setAttribute('src','https://www.youtube.com/embed/RexWt5GFCmQ?rel=0');
  //   // callPlayer('yt-player', 'stopVideo');
  // }
}
