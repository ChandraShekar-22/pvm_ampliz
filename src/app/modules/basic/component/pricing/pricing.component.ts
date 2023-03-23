import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  NgZone,
} from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { HeaderComponent } from "src/app/modules/basic/component/header/header.component";
import { Router } from "@angular/router";
import { MessageService } from "../../../B2B/services/message.service";

@Component({
  selector: "app-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: ["./pricing.component.css"],
})
export class PricingComponent implements OnInit {
  @ViewChild(HeaderComponent) hello: HeaderComponent;
  @ViewChild("yearly", { static: true }) yearlyElement: ElementRef;
  @Input() plan: any;
  myorderStatus = "";
  // product = {
  //   price: 39.99,
  //   description: 'B2B Intelligence you need to get Customers. Personalized.',
  //   // img: 'assets/couch.jpg',
  //   img: 'https://www.ampliz.com/img/sales-intelligence-tool.gif'

  // };
  selectedPlan = "";
  oncancleActive = true;
  paidFor = false;
  showLoader: boolean;
  showError = false;
  loading = false;
  showMsg: boolean;
  response = "";
  responseStatus = "";
  successStatus = false;
  errorStatus = false;
  plan_id = "";
  planId: any;
  subcripId: any;
  billing_history = [];
  amount = "";
  usrsubactive: boolean = false;
  SubscriptionName = "";
  subActive: boolean = false;
  userSelectedyearly: boolean = true;
  userSelectedmonthly: boolean = false;
  public user = null;
  public button = null;
  subscriptionsCredit = 0;
  currentCredit = 0;
  remainingCredit = 0;
  public headerData;
  subscribed: boolean;
  nextbillingdate = "";
  SubDetails = [];
  subcriptionDetails = [];
  subscription: boolean = false;
  isActive = false;
  public upgrade = null;

  subDetails = [];
  @Input() elementName = "dashboard";
  renew = "";
  start_time = new Date("2020-07-01T09:17:37Z");
  time = new Date("2020-07-08T10:00:00Z");
  next_billing_time = new Date("2020-07-01T09:40:13Z");
  create_time = new Date("2020-07-01T09:40:11Z");
  update_time = new Date("2020-07-01T10:12:31Z");
  status_update_time = new Date("2020-07-01T10:12:31Z");
  constructor(
    public amplizService: AmplizService,
    public router: Router,
    private loaderService: LoaderService,
    private ngZone: NgZone,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.getDashboardDetails();
    this.paymentHistory();
    this.checkSubscription();
  }
  async checkSubscription() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //

    if (authToken !== null && refreshToken !== null) {
      this.amplizService.checkSubscriptionStatus().subscribe(
        (res) => {
          //
          if (res[0].Subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("plan", "Basic");
            this.usrsubactive = false;
            this.isActive = false;
            //
          }
          if (res[0].Subscriptions[0].SubscriptionType == "Paid") {
            //
            this.usrsubactive = true;
            this.subscription = true;
            this.isActive = true;
            this.subcriptionDetails = res[0].Subscriptions[0];
          } else {
            this.subscription = false;
            this.isActive = false;
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
  async paymentHistory() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.paymentHistory().subscribe(
        (res) => {
          //
          if (res.length > 0) {
            this.subDetails = res[0].subscription_details;
            for (var i = 0; i < this.subDetails.length; i++) {
              var cube = this.subDetails;
              //
              for (var j = 0; j < cube[i].billing_info.length; j++) {
                var cube1 = cube[i].billing_info;
                //
                this.billing_history.push(cube1[j]);
                // for(var k = 0; k < cube1.billing_info.length; k++) {
                //   var cube2 = cube1;
                //
                //
                //     for(var l = 0; l< cube2.billing_info.lenth; l++){
                //       var cube3 = cube2[l]
                //
                //       this.billing_history.push(cube3);
                //     }
                // }
              }
            }
            //
            this.billing_history.sort((a, b) => {
              return <any>new Date(b.updatedOn) - <any>new Date(a.updatedOn);
            });
          }
          // this.subcriptionName = res[0].subscription_details[0].SubscriptionName
          // this.dtOptions = {
          //   pageLength: 9,
          //   // autoWidth: true,
          //   // stateSave: false,
          //   // data: this.contactDetails,
          // };
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
  test() {
    localStorage.setItem("SubscriptionisActive", "false");
  }
  cancle() {
    this.amplizService.cancleSubscription(this.subcriptionDetails).subscribe(
      (res) => {
        this.loaderService.display(false);
        //
        localStorage.setItem("plan", res.plan);
        localStorage.setItem("SubscriptionisActive", "false");
        this.plan = res.plan;
        this.response = res;
        //
        this.responseStatus = res.msg;
        this.isActive = false;
        this.oncancleActive = false;
        this.button = "Upgrade";
        localStorage.setItem("SubscriptionisActive", "false");
        this.successStatus = true;
        this.messageService.display(true, res.msg);
        localStorage.setItem("SubscriptionisActive", "false");
        this.headerData = "Upgrade";
        this.subscribed = false;
        // this.router.navigateByUrl('pricing')
      },
      (error) => {
        if (error.status === 401) {
          this.loading = false;
          localStorage.clear();
          this.amplizService.logout();
        } else if (error.status === 403) {
          this.loading = false;
          this.response = "Too many requests. Please try after sometime";
          this.errorStatus = true;
          this.successStatus = false;
        } else {
          this.response = error.error.msg;
          this.errorStatus = true;
          this.successStatus = false;
        }
      }
    );
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    this.upgrade = localStorage.getItem("SubscriptionisActive");
    if ((this.upgrade = false)) {
      this.subscribed = false;
      this.headerData = "Upgrade";
    }
    if ((this.upgrade = true)) {
      this.subscribed = true;
    }
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.checkSubscriptionStatus().subscribe(
        (res) => {
          //
          if (res[0].Subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("plan", "Basic");
            this.SubscriptionName = "Basic";
            this.isActive = false;
            this.usrsubactive = false;
          } else {
            localStorage.setItem(
              "plan",
              res[0].Subscriptions[0].SubscriptionName
            );
            this.SubscriptionName = res[0].Subscriptions[0].SubscriptionName;
          }
          this.plan = localStorage.getItem("plan");
          this.SubDetails = res[0].Subscriptions[0];
          this.amount = res[0].Subscriptions[0].SubscriptionAmount;
          this.nextbillingdate = res[0].Subscriptions[0].BillingDate;

          // if(res[0].Subscriptions[0].isActive =  true){
          //   this.isActive = true;
          // }
          // else{
          //   this.isActive = false;
          // }
          if (res[0].Subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Upgrade";
            this.isActive = false;
            this.usrsubactive = false;
            this.subActive = false;
            this.button = "Upgrade";
          }
          if (res[0].Subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
            this.subActive = true;
            this.usrsubactive = true;
            this.button = "button";
          }
          // if(res[0].Subscriptions[0].event_type === "A billing agreement was activated."){
          //   this.renew ="Auto Renew"
          // }
          this.subscriptionsCredit =
            res[0].Subscriptions[0].SubscriptionCredits;
          this.currentCredit = res[0].CurrentCredits;
          this.remainingCredit = this.subscriptionsCredit - this.currentCredit;
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
  pass(res) {
    //
    this.amplizService.paymentAction(res).subscribe(
      (res) => {
        //
        this.myorderStatus = res;
        //
        this.router.navigate(["payment"]);
        // this.handleSubscription(res.stripe_sub)
      },
      (error) => {
        this.loaderService.display(false);
        // this.errorService.display(true, error.error.msg);
        if (error.status === 401) {
          this.loading = false;
          localStorage.clear();
          this.amplizService.logout();
        } else if (error.status === 403) {
          this.loading = false;
          this.response = "Too many requests. Please try after sometime";
          this.errorStatus = true;
          this.successStatus = false;
          this.messageService.display(true, res.msg);
        } else {
          this.loading = false;

          this.response = error.error.msg;
          this.responseStatus = error.error.msg;
          this.errorStatus = true;
          this.successStatus = false;
        }
      }
    );
  }

  public openItem(): void {
    const dataset = localStorage.getItem("Dataset") as string;
    let path = dataset === 'B2B'?'payment':'hcpayment';
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  // openItem(item = 'dashboard') {
  //   this.elementName = item;
  //   if (item === 'payment') {
  //     this.router.navigate(['payment']);
  //   }
  // }
}
