import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AmplizService } from "../../../healthcare/services/ampliz.service";

@Component({
  selector: "app-requesthifi",
  templateUrl: "./requesthifi.component.html",
  styleUrls: ["./requesthifi.component.css"],
})
export class RequesthifiComponent implements OnInit {
  subscriptions = [];
  creditsremaining = 0;
  currentCredit = 0;
  subscribed: boolean;
  public headerData;
  button = "";
  name: string;
  public user = null;
  showReqMsg: boolean = false;
  showAccessData: boolean = false;

  constructor(
    private router: Router,
    private amplizService: AmplizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getDashboardDetails();
    this.name = localStorage.getItem("username");
    //
    let icpReq = this.route.params.subscribe((params) => {
      //
      if (params.name === "dataRequest") {
        this.showReqMsg = true;
      } else {
        this.showAccessData = true;
      }
    });
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
            this.headerData = "Upgrade";
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
            this.headerData = "Upgrade";

            this.button = "Upgrade";
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
}
