import { Component, OnInit, NgZone } from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { Router } from "@angular/router";
import { FilterStorageService } from "../../services/filter-storage.service";
import { MessageService } from "../../../B2B/services/message.service";
@Component({
  selector: "app-hcdashboard",
  templateUrl: "./hcdashboard.component.html",
  styleUrls: ["./hcdashboard.component.css"],
})
export class HcdashboardComponent implements OnInit {
  subscriptions = [];
  subscribed: boolean;
  plan = "";
  public headerData;
  public user = null;
  showLoader: boolean;
  showError = false;
  loading = false;
  showMsg: boolean;
  offset = 0;
  count = 5;
  credits: any;
  allList: any = "";
  constructor(
    private amplizService: AmplizService,
    private loaderService: LoaderService,
    private router: Router,
    private filterStorageService: FilterStorageService,
    private ngZone: NgZone,
    private messageService: MessageService
  ) {}

  get userName() {
    return localStorage.getItem("username");
  }

  // get credits() {
  //   return localStorage.getItem('credits');
  // }
  ngOnInit() {
    this.getDashboardDetails();
    this.getAllList();
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
          this.credits = res.CurrentCredits;
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

  getAllList() {
    this.loaderService.display(false);
    this.amplizService.getAllList(this.offset, this.count).subscribe(
      (res) => {
        //
        this.allList = res.savedlistInfoList;
        //

        this.loaderService.display(false);
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }

  gotoListDetails(item: any) {
    this.router.navigate(["/lists", item.listId]);
  }

  createNewList() {
    this.router.navigate(["/lists"]);
  }

  gotoDetails(val: any) {
    this.filterStorageService.set("physician_specialityIncluded", [val]);
    this.router.navigate(["/physician"]);
  }
  public openItem(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  async requestPricing() {
    const emailId = await localStorage.getItem("email_id");
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
