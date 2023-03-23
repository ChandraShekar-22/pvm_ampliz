import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { CommonFunctionsService } from 'src/app/modules/basic/common/common-functions.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';

import { countries } from '../../../store/country-data-store';
@Component({
  selector: 'app-add-phone',
  templateUrl: './add-phone.component.html',
  styleUrls: ['./add-phone.component.css']
})
export class AddPhoneComponent implements OnInit {
  public countries: Array<any> = countries;
  phoneNumber: any = '';
  otp: string = '';
  countryCode: any;
  callingCode: string = '';
  selectedCountry: any;
  resendButtonActivated: boolean = false;
  @Output() otpVerified = new EventEmitter();
  constructor(private b2bService: B2bService,
    private messageService: MessageService,
    private commonFunction: CommonFunctionsService,
    private loaderService: LoaderService
  ) { }
  showContent: string = "addphone";
  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(pos => {
    //   console.log(pos);
    // });
    // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    this.getCountryCode();
  }

  getCountryCode() {
    const that = this;
    fetch('https://api.ipregistry.co/?key=tryout')
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        // this.callingCode = payload.location.country.calling_code;
        // console.log(payload.location.country.calling_code)
        that.countryCode = payload.location.country.calling_code;
        that.countryCodeChanged();
      }).catch(err => {
        that.countryCode = 91;
        that.countryCodeChanged();
      });
  }
  addPhone(event: any) {
    this.loaderService.display(true);
    const regex = /^\d{10}$/;
    if (this.phoneNumber.match(regex) && this.countryCode) {
      const body = {
        phonumber: this.phoneNumber,
        countryCode: '+' + this.countryCode,
      };
      this.b2bService.addPhoneNumber(body).subscribe(res => {
        this.activateResendIcon();
        this.loaderService.display(false);
        this.messageService.display(true, "An otp has send to the entered phone number", "OTP");
        this.showContent = 'verify';
      }, err => {
        this.loaderService.display(false);
      });
    }
  }

  resendOtp(event: any) {
    const regex = /^\d{10}$/;
    if (this.phoneNumber.match(regex) && this.countryCode&&this.resendButtonActivated==true) {
      this.loaderService.display(true);
      const body = {
        phonumber: this.phoneNumber,
        countryCode: '+' + this.countryCode,
      };
      this.b2bService.sendVerificationCode(body).subscribe(res => {
        this.activateResendIcon();
        this.loaderService.display(false);
        this.messageService.display(true, "An otp has send to the entered phone number", "OTP");
        this.showContent = 'verify';
      }, err => {
        this.loaderService.display(false);
      });
    }
  }
  addContactToList(event) {
    this.loaderService.display(true);
    if (this.otp.length == 6 && this.countryCode) {
      const body = {
        phonumber: this.phoneNumber,
        countryCode: '+' + this.countryCode,
        otp: this.otp
      };
      this.b2bService.verifyPhoneNumber(body).subscribe(res => {
        this.loaderService.display(false);
        this.messageService.display(true, "Successfully verified the otp", "OTP");
        this.otpVerified.emit();
      }, err => {
        this.loaderService.display(false);
      });
    }
  }

  onOtpChange(event) {
    // console.log(event);
    this.otp = event;
  }
  phoneNumberChange(event) {
    // console.log(event, event.target.value)
  }
  countryCodeChanged() {
    this.selectedCountry = this.countries.find(item => item.number == this.countryCode.toString());
  }
  activateResendIcon() {
    this.resendButtonActivated = false;
    setTimeout(() => {
      this.resendButtonActivated = true;
    }, 30000);
  }
}
