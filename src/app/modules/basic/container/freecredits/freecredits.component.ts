import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "../../../healthcare/services/loader.service";

@Component({
  selector: "app-freecredits",
  templateUrl: "./freecredits.component.html",
  styleUrls: ["./freecredits.component.css"],
})
export class FreecreditsComponent implements OnInit {
  validateReedemCodeForm: UntypedFormGroup;
  submitted = false;
  loading = false;
  response = "";
  responseStatus = "";
  successStatus = false;
  errorStatus = false;
  plan = "";
  public headerData;
  public user = null;

  subscriptions = [];
  subscribed: boolean;
  constructor(
    private amplizService: AmplizService,
    private formBuilder: UntypedFormBuilder,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getDashboardDetails();
    this.validateReedemCodeForm = this.formBuilder.group({
      code: ["", [Validators.required, Validators.minLength(6)]],
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

          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
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
          //
        }
      );
    } else {
      this.amplizService.logout();
    }
  }
  get f() {
    return this.validateReedemCodeForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.validateReedemCodeForm.invalid) {
      return;
    }
    // display form values on success
    var myJSON = JSON.parse(JSON.stringify(this.validateReedemCodeForm.value));
    //
    this.amplizService.validatePromocode(myJSON.code).subscribe(
      (res) => {
        this.response = res;
        this.responseStatus = res.msg;
        this.successStatus = true;
        this.errorStatus = false;
        this.loading = false;
        // this.validateReedemCodeForm.reset();

        // this.successService.display(true, res.msg);
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
  somethingChanged() {
    this.successStatus = false;
    this.errorStatus = false;
  }
}
