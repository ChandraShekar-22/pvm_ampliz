import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-panel-loader',
  templateUrl: './company-panel-loader.component.html',
  styleUrls: ['./company-panel-loader.component.css'],
})
export class CompanyPanelLoaderComponent implements OnInit {
  @Input() loopCount = 10;
  Arr = Array;
  constructor() {}

  ngOnInit(): void {}

  numSequence(number: number): Array<number> {
    return this.Arr(number).fill(1);
  }
}
