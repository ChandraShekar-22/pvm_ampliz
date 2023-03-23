import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-daily-search-quota",
  templateUrl: "./daily-search-quota.component.html",
  styleUrls: ["./daily-search-quota.component.css"],
})
export class DailySearchQuotaComponent implements OnInit {
  @Input() dailyCredit: number = 0;
  @Input() usedCredit: number = 0;
  progress: number = 0;
  constructor() {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.progress = (this.usedCredit / this.dailyCredit) * 100;
  }
}
