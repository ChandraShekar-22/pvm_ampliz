import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
  @Input() type: string = 'hc';
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  upgradeBtn() {
    if(this.type=='hc') {
    this.router.navigate(['/hcpayment']);
    } else if(this.type=='b2b') {
      this.router.navigate(['/payment']);
    }
  }

}
