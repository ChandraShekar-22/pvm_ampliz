import { Component, OnInit } from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { ErrorService } from "src/app/modules/healthcare/services/error.service";
import { MessageService } from "../../../B2B/services/message.service";

@Component({
  selector: "app-hcpricing",
  templateUrl: "./hcpricing.component.html",
  styleUrls: ["./hcpricing.component.css"],
})
export class HcpricingComponent implements OnInit {
  subscriptions = [];
  subscribed: boolean;
  plan = "";
  public headerData;
  public user = null;
  showLoader: boolean;
  showError = false;
  loading = false;
  showMsg: boolean;
  constructor(
    private amplizService: AmplizService,
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private messageService: MessageService
  ) {}

  get emailId() {
    return localStorage.getItem("email_id");
  }
  ngOnInit() {
    this.getDashboardDetails();
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

  upgrade(packageName) {
    this.loaderService.display(true);
    const body = { package: packageName, email: this.emailId };
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
        this.errorService.display(
          true,
          error.error.msg ? error.error.msg : "Server Error !!!"
        );
      }
    );
  }
}
