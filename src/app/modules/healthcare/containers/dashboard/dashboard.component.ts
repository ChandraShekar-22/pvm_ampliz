import { Component, OnInit, ɵConsole } from '@angular/core';
import { AmplizService } from '../../services/ampliz.service';
import { CookieService } from 'ngx-cookie-service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

declare var chrome;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private amplizService: AmplizService, private cookieService: CookieService) {}
  subscriptions = [];
  lowCredit: boolean = false;
  chromeData = {};
  currentCredit = 0;
  creditsremaining = 0;
  button = '';
  access_token = '';
  refresh_token = '';
  username = '';
  CurrentCredits = '';
  isPersonaSet = '';
  public user = null;
  showChrmBtn: boolean;
  public headerData;
  hasExtension: boolean = true;
  subscribed: boolean;
  chrome_button = '';
  domainName = '';
  ngOnInit() {
    let match = navigator.userAgent.search(/(?:Chrome|Trident\/.*;)/);
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    let isIE = false;

    if (isChrome) {
      this.checkChromeExtenstion();

      isIE = true;
      //
    }

    this.access_token = this.cookieService.get('auth_token');
    this.refresh_token = this.cookieService.get('refresh_token');
    this.username = localStorage.getItem('username');
    this.CurrentCredits = this.cookieService.get('credits');
    this.isPersonaSet = this.cookieService.get('isPersonaSet');
    if (this.access_token != '') {
      localStorage.setItem('auth_token', this.access_token);
    }
    if (this.username != '') {
      localStorage.setItem('username', this.username);
    }
    if (this.refresh_token != '') {
      localStorage.setItem('refresh_token', this.refresh_token);
    }
    if (this.isPersonaSet != '') {
      localStorage.setItem('isPersonaSet', this.isPersonaSet.toString());
    }
    if (this.CurrentCredits != '') {
      localStorage.setItem('credits', this.CurrentCredits.toString());
    }

    this.getDashboardDetails();
  }

  toggleLowCredit(event: any) {
    this.lowCredit = event;
  }

  checkChromeExtenstion() {
    if (chrome.runtime) {
      chrome.runtime.sendMessage('abgoaphadkcmbkapnamhkcgkaddlmfal', { message: 'isinstalled' }, (response) => {
        //
        if (chrome.runtime.lastError) {
          console.log('IN IF');
          //
          this.showChrmBtn = true;
          //
          this.chromeData = {
            chrome_status: 'Not Installed',
          };
        } else {
          console.log('IN IF');
          this.showChrmBtn = false;
          this.chromeData = {
            chrome_status: 'Installed',
          };
        }
        this.amplizService.chromeStatus(this.chromeData).subscribe(
          (res) => {
            //
          },
          (error) => {
            //
          }
        );
      });
    } else {
      this.showChrmBtn = true;
    }
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem('auth_token');
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem('refresh_token');
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.setCookies(res);
          this.subscriptions = res.Subscriptions;
          //
          this.creditsremaining = res.Subscriptions[0].SubscriptionCredits;
          //

          if (res.Subscriptions[0].SubscriptionName == 'Subscription1') {
            localStorage.setItem('plan', 'Basic');
          } else {
            localStorage.setItem('plan', res.Subscriptions[0].SubscriptionName);
          }
          if (res.Subscriptions[0].SubscriptionType == 'Free') {
            localStorage.setItem('SubscriptionisActive', 'false');
            this.subscribed = false;
            //
            this.headerData = 'Request Pricing';
          }
          if (res.Subscriptions[0].SubscriptionType == 'Paid') {
            //
            localStorage.setItem('SubscriptionisActive', 'true');
            this.subscribed = true;
            this.button = 'button';
          }
          if (this.subscriptions[0].SubscriptionType == 'Free') {
            localStorage.setItem('SubscriptionisActive', 'false');
            this.subscribed = false;
            //
            this.headerData = 'Request Pricing';

            this.button = 'Request Pricing';
          }
          if (this.subscriptions[0].SubscriptionType == 'Paid') {
            //
            localStorage.setItem('SubscriptionisActive', 'true');
            this.subscribed = true;
            this.button = 'button';
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
  async setCookies(res) {
    this.domainName = window.location.hostname;
    const myDate = new Date();
    const subscriptionType = res.Subscriptions[0].SubscriptionType;
    myDate.setMonth(myDate.getMonth() + 12);
    this.domainName = this.domainName.substring(this.domainName.indexOf('.') + 1);
    document.cookie =
      'SubscriptionType = ' + subscriptionType + '; expires=' + myDate + '; path=/; domain=.' + this.domainName;
  }
}
