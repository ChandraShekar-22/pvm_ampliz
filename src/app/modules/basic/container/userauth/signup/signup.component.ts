import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { countries } from 'src/app/modules/B2B/store/country-data-store';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm = new UntypedFormGroup({
    fullname: new UntypedFormControl('',
      [Validators.minLength(5), Validators.required]
    ),
    company_name: new UntypedFormControl('',
      [Validators.minLength(3), Validators.required]
    ),
    email: new UntypedFormControl('', [Validators.email, Validators.required]),
    phone: new UntypedFormControl('', [Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]),
    role: new UntypedFormControl('',
      [Validators.required]
    ),
    no_of_sales_people_at_company: new UntypedFormControl('',
      [Validators.required]
    ),
    dataset: new UntypedFormControl('',
      [Validators.required]
    ),
    password: new UntypedFormControl('',
      [Validators.required, Validators.minLength(5),]
    ),

  });
  public countries: Array<any> = countries;
  roleOptions: any[] = ['VP Sales', 'Outside Sales', 'Inside Sales', 'Sales OPS', 'Marketing', 'Human Resource', 'C-suit/Executive'];
  peopleOptions: any[] = ['1', '2', '3-10', '11-100', '101-1000', '1000+'];
  dataSetOptions: any[] = ['B2B', 'healthcare'];
  countryCode: any = 'US';
  selectedCountry: any = { code:"US", code3:"USA", name:"United States", number:"1",flag:"US" };
  inviteId: any;
  pageType: any;
  isFormSubmitted: boolean = false;

  constructor(
    private amplizService: AmplizService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.signupForm = this.formBuilder.group({
    //   name: [Validators.required, Validators.minLength(10), Validators.maxLength(12)]
    // })
    this.activateRoute.params.subscribe((params) => {
      this.inviteId = params.inviteId;
      this.pageType = params.type;
      this.checkForValidRoute(this.pageType);
    });

  }

  checkForValidRoute(pageType: any) {
    if(pageType&&(pageType!=='invited'&& pageType!=='ref')) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    // this.signupForm.su
    let service: any;
    // console.log(this.signupForm.value)
    this.isFormSubmitted = true;

    if (this.signupForm.valid) {
      this.loaderService.display(true);
      if(this.signupForm.value.phone!=='') {
      this.signupForm.value.phone = `+${this.selectedCountry.number+this.signupForm.value.phone}`;
      }
      if(this.pageType=='invited') {
        this.inviteeSignup()
      } else {
        this.normalSignup();
      }

    }
    // this.signupForm.reset();
  }

  inviteeSignup() {
    const body = {
      inviteeId: this.inviteId,
      ...this.signupForm.value
    }
    this.amplizService.inviteeSignUp(body).subscribe(res => {
      this.loaderService.display(false);
      if(res.msgInfo) {
      this.messageService.display(true, res.msgInfo.msg||"Success");
      }
      // this.router.navigate(['/login']);
      this.router.navigate(['/verify']);
    },
    err => {
      this.loaderService.display(false);
    });
  }

  normalSignup() {
    this.amplizService.signUp(this.signupForm.value).subscribe(res => {
      this.loaderService.display(false);
      if(res.msgInfo) {
      this.messageService.display(true, res.msgInfo.msg||"Success");
      }
      localStorage.setItem("signedUpEmail", this.signupForm.value.email);
      this.router.navigate(['/verify']);
    },
    err => {
      this.loaderService.display(false);
    });
  }

  countryCodeChanged() {
    this.selectedCountry = this.countries.find(item => item.number == this.countryCode.toString());
  }

  handleCountrySelect(event) {
    // console.log(event,"In signup");
    this.selectedCountry = event;
  }
}
