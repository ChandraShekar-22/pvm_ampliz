import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-quota',
  templateUrl: './search-quota.component.html',
  styleUrls: ['./search-quota.component.css'],
})
export class SearchQuotaComponent implements OnInit {

  @Input() progress: any = 100;
  constructor(
    private ngZone: NgZone,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  openPayment() {
    this.ngZone.run(() => this.router.navigateByUrl('payment')).then();
  }

}
