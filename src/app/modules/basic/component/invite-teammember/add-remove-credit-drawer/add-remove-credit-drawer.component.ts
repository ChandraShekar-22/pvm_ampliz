import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { ActiveUser, SeatsCreditsStatus } from '../../../models/invite-teammember-models';

@Component({
  selector: 'app-add-remove-credit-drawer',
  templateUrl: './add-remove-credit-drawer.component.html',
  styleUrls: ['./add-remove-credit-drawer.component.css']
})
export class AddRemoveCreditDrawerComponent implements OnInit {
  @Output() closeAddRemoveDrawer: EventEmitter<any> = new EventEmitter();
  @Output() creditChangedSuccess: EventEmitter<any> = new EventEmitter();
  @Input() user: ActiveUser = new ActiveUser();
  @Input() seatsCreditsStatus: SeatsCreditsStatus = new SeatsCreditsStatus();
  allocatedCreditType: string = 'Recurring';
  maximumCredits: number = 0;

  credits = 0;

  constructor(
    private amplizService: AmplizService,
    private loaderService: LoaderService
  ) { }

  get showInfo(): boolean {
    if (this.allocatedCreditType === 'Recurring') {
      return this.user.availableRecurringCredits !== this.credits;
    } else {
      // console.log(this.user.availableCredits, this.credits);
      return this.user.availableCredits !== this.credits;
    }

  }

  ngOnInit() {
    this.handleCreditTypeChange('Recurring')
  }


  removeCreditHandler() {
    this.credits--;
    if (this.credits < 0) {
      this.credits = 0;
    }
  }

  addCreditHandler() {
    if (this.credits < this.maximumCredits) {
      this.credits++;
    }
  }


  // add remove teammate handler
  handlerAddRemoveTeammateDrawer() {
    this.closeAddRemoveDrawer.emit();
  }


  submitCredit() {
    this.loaderService.display(true);
    if (this.allocatedCreditType === 'Recurring') {
      this.allocateReccuringCredit();
    } else {
      this.allocateOneTimeCredit();
    }

  }

  allocateOneTimeCredit() {
    let body = {
      numberOfCredits: this.credits,
      teamMemberUserId: this.user.userId,
    };
    this.amplizService.allocateOneTimeCredit(body).subscribe(res => {
      this.creditChangedSuccess.emit();
      this.loaderService.display(false);
    },
      err => {
        this.loaderService.display(false);
      });
  }

  allocateReccuringCredit() {
    let body = {
      numberOfCredits: this.credits,
      teamMemberUserId: this.user.userId,
    };
    this.amplizService.allocateReccuringCredit(body).subscribe(res => {
      this.creditChangedSuccess.emit();
      this.loaderService.display(false);
    },
      err => {
        this.loaderService.display(false);
      });
  }

  handleCreditTypeChange(creditType: string) {
    this.allocatedCreditType = creditType;
    if (this.allocatedCreditType === 'Recurring') {
      this.credits = this.user.availableRecurringCredits;
      this.maximumCredits = this.seatsCreditsStatus.availableRecurringCredits;
    } else {
      this.credits = this.user.availableCredits;
      if(this.seatsCreditsStatus.availableCredits>this.user.availableCredits) {
        this.maximumCredits = this.seatsCreditsStatus.availableCredits;
      } else {
        this.maximumCredits = this.user.availableCredits;
      }

    }

  }


}
