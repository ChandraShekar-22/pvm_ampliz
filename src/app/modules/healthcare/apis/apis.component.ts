import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-apis",
  templateUrl: "./apis.component.html",
  styleUrls: ["./apis.component.css"],
})
export class ApisComponent implements OnInit {
  subscriptions = [];
  subscribed: boolean;
  plan = "";
  public headerData;
  public user = null;
  showLoader: boolean;
  showError = false;
  loading = false;
  showMsg: boolean;
  apiKey: any;
  buttonShow = [true, false, false];
  createdOn = "";
  showCopyMessage: boolean = false;
  isSavedApiKey: boolean = false;

  constructor(
    private amplizService: AmplizService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loaderService.display(true);
    this.getDashboardDetails();

    if (this.subscribed) {
      this.getSavedApiKey();
    }
    this.loaderService.display(false);
  }

  // get userSubscriptions() {
  //   return localStorage.getItem('SubscriptionisActive');
  // }

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

          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Request Pricing";
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
          //
        }
      );
    } else {
      this.amplizService.logout();
    }
  }

  generateKey() {
    //
    this.amplizService.generateApiKey().subscribe((res) => {
      this.apiKey = res.api_key;
      this.buttonShow = [false, true, false];
      this.loaderService.display(false);
    });
  }

  getSavedApiKey() {
    this.amplizService.getSavedApiKey().subscribe((res) => {
      this.apiKey = res.apiKey;
      this.createdOn = res.createdOn;
      this.buttonShow = [false, true, false];
      this.isSavedApiKey = true;
      this.loaderService.display(false);
    });
  }

  copied(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    this.showCopyMessage = true;

    setTimeout(this.hideElement, 2000);

    this.buttonShow = [false, false, true];
  }
  hideElement() {
    const timeout = document.getElementById("showCopyMessage");
    timeout.style.display = "none";
  }

  upgradeBtn() {
    this.router.navigate(["/hcpayment"]);
  }
}
