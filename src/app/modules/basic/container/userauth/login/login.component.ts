import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { ErrorService } from 'src/app/modules/healthcare/services/error.service';
import { SuccessmessageService } from 'src/app/modules/healthcare/services/successmessage.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  passwordShow = false;
  domainName = '';
  loginBody = {
    email: '',
    pwd: '',
  };
  signupBody = {
    email: '',
  };
  forgotBody = {
    email: '',
  };
  showLoader: boolean;
  showError = false;
  showMsg: boolean = false;
  currentScene = 'login';
  errmsg = false;
  invitationCode = '';
  alertContent: any = {};
  showInlineError: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;
  // @Input() border: boolean = true;
  // @Input() success: boolean = false;
  // @Input() hasError: boolean = true;
  // @Input() row: boolean = true;
  // @Input() successHeading: string = "Feedback saved sucessfully";
  // @Input() successSubHeading: string = "We got your feedback, will get back to you soon on this";
  // @Input() errorHeading: string = "Feedback failed";
  // @Input() errorSubHeading: string = "We got your feedback, will get back to you soon on this";
  // invite=LHK9AJRE
  inviteMessage: any = {
    success: {
      heading: 'You have successfully logged in',
      subHeading: 'You have some sub heading',
    },
    error: {
      heading: 'Your invitaiton is expired',
      subHeading: 'You can request for new invitation',
    },
  };
  constructor(
    private amplizService: AmplizService,
    private router: Router,
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private successService: SuccessmessageService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      let code = params.invite;
      if (code && code !== '') {
        this.invitationCode = code;
        this.isInvitationActive(code);
      }
    });
    this.loaderService.status.subscribe((res) => {
      this.showLoader = res;
    });

    this.errorService.statusActive.subscribe((res) => {
      this.showError = res;
    });
    this.successService.statusActive.subscribe((res) => {
      this.showMsg = res;
      //
    });
    this.checkStorage();
  }
  ngAfterViewInit(): void {}
  // async login() {
  //   this.loaderService.display(true);
  //   this.amplizService.login(this.loginBody).subscribe(async res => {
  //     await localStorage.setItem('auth_token', res.access_token);
  //     await localStorage.setItem('refresh_token', res.refresh_token);
  //     await localStorage.setItem('username', res.username);
  //     this.loaderService.display(false);
  //     this.router.navigate(['']);
  //   },
  //     error => {
  //       this.loaderService.display(false);
  //
  //       this.errorService.display(true, error.error.msg ? error.error.msg : 'Error');
  //     });
  // }
  isInvitationActive(code) {
    this.amplizService.isInvitationActive(code).subscribe((res) => {
      if (!res.active) {
        this.alertContent = this.inviteMessage.error;
        this.showInlineError = true;
      } else {
        this.alertContent = {};
        this.showInlineError = false;
      }
    });
  }
  requestInvite() {
    this.amplizService.reInvite(this.invitationCode).subscribe((res) => {});
  }
  async login() {
    // this.loaderService.display(true);
    const validation = { email: false, password: false };
    const msg = [
      'Please Enter a Valid Email Address',
      'Please Enter a Valid Password',
      'Invalid Credentials',
    ];
    this.emailError = false;
    this.passwordError = false;
    let msgToShow = -1;
    if (
      this.loginBody.email !== '' &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.loginBody.email)
    ) {
      validation.email = true;
      if (this.loginBody.pwd !== '') {
        validation.password = true;
        // this.errorService.display(true, 'Please enter a password');
      } else {
        this.passwordError = true;
        msgToShow = 1;
      }
      // this.errorService.display(true, 'Please enter an emailId');
    } else {
      this.emailError = true;
      msgToShow = 0;
    }

    // if (validation.email === false || validation.password === false) {
    //   msgToShow = 2;
    // }
    if (msgToShow !== -1) {
      this.messageService.displayError(true, msg[msgToShow]);
    } else {
      this.loaderService.display(true);
      this.domainName = window.location.hostname;

      const myDate = new Date();
      myDate.setMonth(myDate.getMonth() + 1);
      this.domainName = this.domainName.substring(
        this.domainName.indexOf('.') + 1
      );
      document.cookie =
        'email_id=' +
        this.loginBody.email +
        '; expires=' +
        myDate +
        '; path=/; domain=.' +
        this.domainName;

      this.amplizService.login(this.loginBody).subscribe(
        async (res) => {
          await this.setCookies(res);

          // let is_SpecialityUser = "true";
          await this.setLocal(res);

          this.loaderService.display(false);
          // console.log(res.Dataset);
          // console.log(res);
          if (res.Dataset === 'B2B') {
            this.router.navigate(['onboard']);
          } else {
            this.router.navigate(['hconboard']);
          }
        },
        (error) => {
          this.loaderService.display(false);
          this.messageService.displayError(true, "Invalid Credentials");
          // const err_msg = error.error.msg;
          // // if(err_msg === "Email not yet verified, please verify the email"){
          // //
          // //   this.errmsg = true;
          // //   this.domainName = window.location.hostname;
          // //
          // //   const myDate = new Date();
          // //   myDate.setMonth(myDate.getMonth() + 1);
          // //   this.domainName = this.domainName.substring(this.domainName.indexOf('.')+1);
          // //   document.cookie = 'uid='+ error.error.user_id +'; expires='+ myDate +'; path=/; domain=.' + this.domainName;
          // // }
          // // else{
          // this.messageService.displayError(
          //   true,
          //   error.msg ? error.msg : 'Error'
          // );
          // // }
        }
      );
    }
  }

  showScreen(screen) {
    this.currentScene = screen;
    this.signupBody.email = '';
    this.forgotBody.email = '';
    this.loginBody = {
      email: '',
      pwd: '',
    };
  }

  signup() {
    this.loaderService.display(true);
    if (
      this.signupBody.email !== '' &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.signupBody.email
      )
    ) {
      this.amplizService.signUp(this.signupBody).subscribe(
        (res) => {
          this.loaderService.display(false);
          //
          this.messageService.display(true, res.msg);
          this.showScreen('login');
          this.signupBody.email = '';
        },
        (error: any) => {
          this.loaderService.display(false);
          this.messageService.displayError(true, error.error.msg);
        }
      );
    } else {
      this.loaderService.display(false);
      this.messageService.displayError(
        true,
        'Please Enter a Valid Email Address'
      );
    }
  }

  forgot() {
    this.loaderService.display(true);
    if (
      this.forgotBody.email !== '' &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.forgotBody.email
      )
    ) {
      this.amplizService.forgot(this.forgotBody).subscribe(
        (res) => {
          this.loaderService.display(false);
          //
          this.messageService.display(true, res.msg);
          this.showScreen('login');
          this.forgotBody.email = '';
        },
        (error: any) => {
          this.loaderService.display(false);
          this.messageService.displayError(true, error.error.msg);
        }
      );
    } else {
      this.loaderService.display(false);
      this.messageService.displayError(
        true,
        'Please Enter a Valid Email Address'
      );
    }
  }
  async checkStorage() {
    const authToken = await localStorage.getItem('auth_token');
    const refreshToken = await localStorage.getItem('refresh_token');
    const dataSet = await localStorage.getItem('Dataset');
    if (authToken !== null && refreshToken !== null) {
      if (dataSet === 'B2B') {
        this.router.navigate(['dashboard']);
      } else {
        // this.router.navigate(["hcdashboard"]);
      }
    } else {
      // await this.amplizService.logout();
    }
  }
  showPassword(val) {
    this.passwordShow = val;
    //
  }

  openUrl(url) {
    const siteUrl = 'https://' + url;
    window.open(siteUrl);
  }
  setCookies(res) {
    this.domainName = window.location.hostname;

    const myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    this.domainName = this.domainName.substring(
      this.domainName.indexOf('.') + 1
    );
    // document.cookie = 'auth_token = ' + res.access_token + '; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/; domain=.' + this.domainName;
    // document.cookie = 'refresh_token = ' + res.refresh_token + '; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/; domain=.' + this.domainName;
    // document.cookie = 'username = ' + res.username + '; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/';
    // document.cookie = 'credits = ' + res.CurrentCredits + '; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/';
    // document.cookie = 'isPersonaSet = ' + res.isPersonaSet + '; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/';
    document.cookie =
      'auth_token = ' +
      res.access_token +
      '; expires=' +
      myDate +
      '; path=/; domain=.' +
      this.domainName;
    document.cookie =
      'refresh_token = ' +
      res.refresh_token +
      '; expires=' +
      myDate +
      '; path=/; domain=.' +
      this.domainName;
    document.cookie =
      'username = ' +
      res.username +
      '; expires=' +
      myDate +
      '; path=/; domain=.' +
      this.domainName;
    document.cookie =
      'credits = ' +
      res.CurrentCredits +
      '; expires=' +
      myDate +
      '; path=/; domain=.' +
      this.domainName;
    document.cookie =
      'isPersonaSet = ' +
      res.isPersonaSet +
      '; expires=' +
      myDate +
      '; path=/; domain=.' +
      this.domainName;
    document.cookie =
      'Dataset = ' +
      res.Dataset +
      '; expires=' +
      myDate +
      '; path=/; domain=.' +
      this.domainName;
    document.cookie =
      'amp_u=1;expires=' + myDate + '; path=/; domain=.' + this.domainName;
  }
  async setLocal(res) {
    await localStorage.setItem('auth_token', res.access_token);
    await localStorage.setItem('refresh_token', res.refresh_token);
    await localStorage.setItem('username', res.username);
    await localStorage.setItem('credits', res.CurrentCredits.toString());
    await localStorage.setItem('isPersonaSet', res.isPersonaSet.toString());
    await localStorage.setItem('Dataset', res.Dataset);
    let is_SpecialityUser = res.isSpecialityUser || 'false';
    await localStorage.setItem(
      'is_SpecialityUser',
      is_SpecialityUser.toString().toLowerCase()
    );
    // await localStorage.setItem("Dataset", 'healthcare');

    await localStorage.setItem('email_id', this.loginBody.email);
    // localStorage.setItem('email_id',this.loginBody.email);
  }
}
