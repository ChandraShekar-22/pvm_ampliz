import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';
@Component({
  selector: 'app-quota-card',
  templateUrl: './quota-card.component.html',
  styleUrls: ['./quota-card.component.css'],
})
export class QuotaCardComponent implements OnInit {
  @Input() username: string;
  @Input() subscription: boolean;
  @Output() lowCredit: EventEmitter<boolean> = new EventEmitter<boolean>();

  loader = false;
  credit = {
    dailyUsedCredit: 0,
    dailyCredit: 0,
    totalCredit: 0,
    totalUsedCredit: 0,
    dailyPercentage: 0,
  };
  quota = {
    dailyUsedQuota: 0,
    dailyQuota: 0,
    totalQuota: 0,
    totalUsedQuota: 0,
    totalPercentage: 0,
    dailyPercentage: 0,
  };

  constructor(private dataService: DataService, private b2bService: B2bService, private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.dataService.subscriptionStatus.subscribe((status: any) => {
        this.sortCredits(status);
      });
      this.sortQuota();
      this.subscription = localStorage.getItem('SubscriptionisActive') == 'true';
    }, 500);
  }

  sortCredits(credit: any) {
    this.credit.dailyCredit = credit.dailyCredit;
    this.credit.dailyUsedCredit = credit.usedCredit;
    this.credit.dailyPercentage = (credit.usedCredit / credit.dailyCredit) * 100;
    if (this.credit.dailyPercentage >= 80) {
      this.lowCredit.emit(true);
    }
  }

  sortQuota() {
    this.b2bService.getSearchQuota().subscribe((res) => {
      this.quota.dailyQuota = res.dailySearchQuota;
      this.quota.dailyUsedQuota = res.dailyUsedQuota;
      this.quota.totalQuota = res.quota;
      this.quota.totalUsedQuota = res.remainingQuota;
      this.quota.dailyPercentage = (res.dailyUsedQuota / res.dailySearchQuota) * 100;
      this.quota.totalPercentage = (res.remainingQuota / res.quota) * 100;
    });
  }
}
