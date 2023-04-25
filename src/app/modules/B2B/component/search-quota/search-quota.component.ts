import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-quota',
  templateUrl: './search-quota.component.html',
  styleUrls: ['./search-quota.component.css'],
})
export class SearchQuotaComponent implements OnInit {
  @Input() usedQuota: any = 0;
  @Input() dailyQuota: any = 0;
  @Input() isSubscribed: boolean;
  progress: number = 0;
  constructor(private ngZone: NgZone, public router: Router) {}

  ngOnInit() {
    this.progress = (this.usedQuota / this.dailyQuota) * 100;
  }

  openPayment() {
    this.ngZone.run(() => this.router.navigateByUrl('payment')).then();
  }
}
