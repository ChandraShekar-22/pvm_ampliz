import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MustMatch } from "src/app/modules/basic/helper/must-match.validator";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { HeaderComponent } from "src/app/modules/basic/component/header/header.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "../../../B2B/services/message.service";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.css"],
})
export class EditprofileComponent implements OnInit {
  @ViewChild(HeaderComponent) hello: HeaderComponent;

  profileForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  submitted = false;
  pwdSubmitted = false;
  showLoader: boolean;
  showError = false;
  showMsg: boolean;
  loading = false;
  response = "";
  profileResponse;
  username = "";
  public user;
  public upgrade = null;
  responseStatus = "";
  successStatus = false;
  errorStatus = false;
  public headerData;
  subscribed: boolean = false;

  public firstName = null;
  public lastName = null;
  public company = null;
  public phone = null;
  access_token = "";
  refresh_token = "";
  CurrentCredits = "";
  isPersonaSet = "";
  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private amplizService: AmplizService,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private messageService: MessageService
  ) {
    this.access_token = this.cookieService.get("auth_token");
    this.refresh_token = this.cookieService.get("refresh_token");
    this.username = this.cookieService.get("username");
    this.CurrentCredits = this.cookieService.get("credits");
    this.isPersonaSet = this.cookieService.get("isPersonaSet");
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
    this.upgrade = localStorage.getItem("SubscriptionisActive");
    this.user = localStorage.getItem("username");
    if (this.upgrade == "false") {
      this.subscribed = false;
      //
      this.headerData = "Upgrade";
    }
    if (this.upgrade == "true") {
      //
      this.subscribed = true;
    }
  }

  ngOnInit() {
    this.createDemoForm();
    //   this.profileForm = this.formBuilder.group({
    //     FirstName: [this.Firstname, [Validators.required,Validators.pattern('[a-zA-Z]+')]],
    //     LastName: ['', [Validators.required,Validators.pattern('[a-zA-Z]+')]],
    //     Phone: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10)]],
    //     CompanyName:['',[Validators.required,Validators.pattern('[a-zA-Z]+')]]
    // });
    this.passwordForm = this.formBuilder.group(
      {
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      }
    );
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }
  get pf() {
    return this.passwordForm.controls;
  }

  onPwdFormSubmit() {
    this.pwdSubmitted = true;
    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }
    // display form values on success
    if (this.passwordForm.valid) {
      var myJSON = JSON.parse(JSON.stringify(this.passwordForm.value));
      this.amplizService.changePassowrd(myJSON.password).subscribe(
        (res) => {
          this.response = res;
          this.responseStatus = res.msg;
          this.successStatus = true;
          this.messageService.display(true, res.msg);
        },
        (error) => {
          this.loaderService.display(false);
          this.messageService.displayError(true, "Error");
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
            this.responseStatus = error.error.msg;
            this.errorStatus = true;
          }
        }
      );
    }
  }
  domainName = "";
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }
    if (this.profileForm.valid) {
      var myJSON = JSON.parse(JSON.stringify(this.profileForm.value));
      this.amplizService.editprofile(myJSON).subscribe(
        (res) => {
          this.response = res;
          this.responseStatus = res.msg;
          this.successStatus = true;
          this.messageService.display(true, res.msg);
          this.user = myJSON.FirstName;
          if (res.msg && res.msg_type === 1) {
            this.domainName = window.location.hostname;
            const myDate = new Date();
            myDate.setMonth(myDate.getMonth() + 12);
            this.domainName = this.domainName.substring(
              this.domainName.indexOf(".") + 1
            );
            // this.cookieService.delete("username", '/');
            document.cookie =
              "username = " +
              myJSON.FirstName +
              "; expires=" +
              myDate +
              "; path=/; domain=." +
              this.domainName;
            // this.cookieService.set('username', myJSON.FirstName);
            localStorage.setItem("username", myJSON.FirstName);
          }
          // this.reloadComponent();
          // this.ngOnInit();
        },
        (error) => {
          this.loaderService.display(false);
          this.messageService.displayError(true, "Error");
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
            this.response = error.error.msg;
            this.responseStatus = error.error.msg;
            this.errorStatus = true;
          }
        }
      );
    }
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.passwordForm.value, null, 4));
  }
  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["/editprofile"]);
  }
  onReset() {
    this.submitted = false;
    this.profileForm.reset();
  }
  onPasswordFormCancle() {
    this.pwdSubmitted = false;
    this.passwordForm.reset();
  }
  async fetchProfile() {}

  async createDemoForm() {
    this.amplizService.getProfile().subscribe(
      (res) => {
        this.profileResponse = res;
        // this.firstName =  ;
        if (this.profileResponse[0].Phone == 0) {
          this.profileResponse[0].Phone = "";
        }
        this.user = this.profileResponse[0].FirstName;

        this.profileForm = this.formBuilder.group({
          FirstName: [
            this.profileResponse[0] ? this.profileResponse[0].FirstName : "",
            [
              Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
              Validators.minLength(3),
              Validators.required,
            ],
          ],
          LastName: [
            this.profileResponse[0] ? this.profileResponse[0].LastName : "",
            [
              Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
              Validators.minLength(3),
            ],
          ],
          Phone: [
            this.profileResponse[0].Phone,
            [Validators.pattern("^[+]?[0-9]+$"), Validators.minLength(10)],
          ],
          CompanyName: [
            this.profileResponse[0] ? this.profileResponse[0].CompanyName : "",
            [
              Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
              Validators.minLength(3),
              Validators.required,
            ],
          ],
        });
      },
      (error) => {
        this.loaderService.display(false);
        // this.errorService.display(true, error.error.msg);
        // this.messageService.displayError(true, "Error");
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
}
