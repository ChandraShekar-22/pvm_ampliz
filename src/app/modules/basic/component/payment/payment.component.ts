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
import { Router } from "@angular/router";
import { MessageService } from "../../../B2B/services/message.service";
declare var paypal;
@Component({
  selector: "app-pricing",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent implements OnInit {
  @ViewChild("paypal", { static: true }) paypalElement: ElementRef;
  @ViewChild("month", { static: true }) monthly;
  @ViewChild("year", { static: true }) yrly;
  myorderStatus = "";
  plan = "";
  product = {
    price: 39.99,
    description: "B2B Intelligence you need to get Customers. Personalized.",
    // img: 'assets/couch.jpg',
    img: "https://www.ampliz.com/img/sales-intelligence-tool.gif",
  };
  public headerData;
  subscribed: boolean;
  selectedPlan = "";
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
  dtOptions: DataTables.Settings = {};
  dtOptions1: DataTables.Settings = {};
  subscription: boolean = false;
  contactDetails = [];
  subDetails = [];
  subcriptionDetails = "";
  subcriptionName = "";
  planId: any;
  monthsel: boolean = false;
  yearsel: boolean = true;
  existedMonthlyPlan: boolean = false;
  existedYearlyPlan: boolean = false;
  SubscriptionName = "";
  public user = null;

  constructor(
    public amplizService: AmplizService,
    public router: Router,
    private loaderService: LoaderService,
    private ngZone: NgZone,
    private messageService: MessageService
  ) {
    this.plan = localStorage.getItem("plan");
    //
    if (this.plan === "Basic") {
      this.planId = "P-8GB39286FL8521414L4EHNHQ";
    }
    if (this.plan === "Yearly") {
      this.planId = "P-6LB210067Y425543LL4EDDNQ";
    }
    if (this.plan === "Monthly") {
      this.planId = "P-8GB39286FL8521414L4EHNHQ";
    }
  }
  ngOnInit() {
    const url = this.router.url;
    this.selectedPlan = url.split("/").pop();
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 7,
    };
    this.dtOptions1 = {
      pagingType: "full_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      columnDefs: [{ width: "40%", targets: 5 }],
    };

    this.getDashboardDetails();

    this.checkSubscription();
    //

    const self = this;
    // this.planId = '';  //Default Plan Id
    paypal
      .Buttons({
        createSubscription: function (data, actions) {
          return actions.subscription.create({
            plan_id: self.planId,
          });
        },
        onApprove: async (data, actions) => {
          //
          // alert('You have successfully created subscription ' + data.subscriptionID);
          // self.getSubcriptionDetails(data.subscriptionID);
          // this.pass(data);
          this.paidFor = true;
        },
        onCancel: function (data) {
          // Show a cancel page, or return to cart
          //
        },
        onError: function (err) {
          // Show an error page here, when an error occurs
          //
        },
      })
      .render(this.paypalElement.nativeElement);

    // if(this.selectedPlan == "monthly"){
    //   paypal.Buttons({
    //     createSubscription: function(data, actions) {
    //       return actions.subscription.create({
    //         'plan_id': 'P-62167583NX339741GL3KHZGI'
    //         // 'plan_id': 'P-18934381P4557442KL3INRII'
    //       });
    //     },
    //     onApprove: async (data, actions) =>{
    //

    //       // alert('You have successfully created subscription ' + data.subscriptionID);
    //       this.pass(data);
    //       this.paidFor = true;
    //     },
    //         onError: err => {
    //
    //         }
    //   }).render(this.paypalElement.nativeElement);  }
    // else if(this.selectedPlan =="yearly"){
    //   paypal.Buttons({
    //     createSubscription: function(data, actions) {
    //       return actions.subscription.create({
    //         'plan_id': 'P-0XB02880VG245713XL3IP72Y'
    //         // 'plan_id': 'P-18934381P4557442KL3INRII'
    //       });
    //     },
    //     onApprove: async (data, actions) =>{
    //
    //       // alert('You have successfully created subscription ' + data.subscriptionID);
    //       this.pass(data);
    //       this.paidFor = true;
    //     },
    //         onError: err => {
    //
    //         }
    //   }).render(this.paypalElement.nativeElement);  }
    // else{
    //   this.router.navigate(['pricing'])  }
  }

  visibleIndex = -1;
  showSubItem(ind) {
    //
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }
  async checkSubscription() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.checkSubscriptionStatus().subscribe(
        (res) => {
          if (res[0].Subscriptions[0].isActive) {
            this.subscription = true;
            this.subcriptionDetails = res[0].Subscriptions[0];
          } else {
            this.subscription = false;
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
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.plan = localStorage.getItem("plan");
      //

      if (this.plan === "Yearly") {
        this.existedYearlyPlan = true;
        this.existedMonthlyPlan = false;
        this.yearsel = false;
        this.monthsel = true;
      }
      if (this.plan === "Monthly") {
        this.existedMonthlyPlan = true;
        this.existedYearlyPlan = false;
        this.yearsel = true;
        this.monthsel = false;
      }

      this.amplizService.checkSubscriptionStatus().subscribe(
        (res) => {
          if (res[0].Subscriptions[0].SubscriptionName == "Subscription1") {
            localStorage.setItem("plan", "Basic");
            this.SubscriptionName = "Basic";
          } else {
            localStorage.setItem(
              "plan",
              res[0].Subscriptions[0].SubscriptionName
            );
            this.SubscriptionName = res[0].Subscriptions[0].SubscriptionName;
          }
          if (res[0].Subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            // this.headerData = "Upgrade";
          }
          if (res[0].Subscriptions[0].SubscriptionType == "Paid") {
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
  cancle() {
    //

    this.amplizService.cancleSubscription(this.subcriptionDetails).subscribe(
      (res) => {
        this.loaderService.display(false);
        //
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
  changetoMonth() {
    this.monthsel = !this.monthsel;
    this.yearsel = false;
  }
  changetoYear() {
    this.monthsel = false;
    this.yearsel = !this.yearsel;
  }
  pass(res) {
    //
    this.loading = true;

    this.amplizService.paymentAction(res).subscribe(
      (res) => {
        //
        this.myorderStatus = res;
        //
        // this.handleSubscription(res.stripe_sub)
        localStorage.setItem("plan", res.plan);
        localStorage.setItem("SubscriptionisActive", "true");

        this.router.navigate(["pricing"]);

        this.response = res;
        this.loading = false;
        this.responseStatus = res.msg;
        this.successStatus = true;
        this.messageService.display(true, res.msg);
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
  public openItem(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
