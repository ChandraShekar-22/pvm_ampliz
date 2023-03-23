import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AmplizService } from "../../services/ampliz.service";

@Component({
  selector: "app-healthcareonboard",
  templateUrl: "./healthcareonboard.component.html",
  styleUrls: ["./healthcareonboard.component.css"],
})
export class HealthcareonboardComponent implements OnInit {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private amplizService: AmplizService
  ) {}
  subscriptions = [];
  chromeData = {};
  currentCredit = 0;
  creditsremaining = 0;
  button = "";
  dataSet = "";
  access_token = "";
  refresh_token = "";
  username = "";
  CurrentCredits = "";
  isPersonaSet = "";
  public user = null;
  showChrmBtn: boolean;
  public headerData;
  hasExtension: boolean = true;
  subscribed: boolean;
  selectedTab: number = 0;
  newLaunchUpdates: any[] = [
    {
      icon: "assets/images/LTC.svg",
      title: "Long term care centers",
      description:
        "Finding Contact Data Information was never so easy before Ampliz. With our 12,280 extensive database, get instant access to your targeted contacts. Harvest fresh and authentic data to pump up your business growth",
      options: [
        "Assisted leaving",
        "Home healthcare",
        "Hospices",
        "Retirement communities",
        "Nursing home",
      ],
      navigate: "ltc",
    },
    {
      icon: "assets/images/Imaging-center.svg",
      title: "Imaging centers",
      description:
        "Start efficient prospecting with our 17,000 Imaging Center database. Reach your targeted buyer personas instantly with our advanced data filters. Acquire knowledge of demographics, affiliations, and other information for effective marketing, sales, and recruitment strategies.",
      options: [
        "Patient demographics",
        "Network affiliations",
        "Technology installations",
        "Procedure volumes",
      ],
      navigate: "imaging",
    },
  ];

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
  openDashboard() {
    // this.router.navigate(["hcdashboard"]);
  }
  openPaymentPage(where: any) {
    this.router.navigate([where]);
  }

  changeTab() {
    if (this.selectedTab === this.newLaunchUpdates.length - 1) {
      this.selectedTab = 0;
    } else {
      this.selectedTab++;
    }
  }
}
