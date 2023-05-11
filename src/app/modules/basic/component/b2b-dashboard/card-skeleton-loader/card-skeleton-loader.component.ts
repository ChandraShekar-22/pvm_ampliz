import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-skeleton-loader',
  templateUrl: './card-skeleton-loader.component.html',
  styleUrls: ['./card-skeleton-loader.component.css'],
})
export class CardSkeletonLoaderComponent implements OnInit {
  @Input() loopCount = 10;
  @Input() fromDashboard: boolean = false;

  Arr = Array;
  constructor() {}

  ngOnInit(): void {}

  numSequence(number: number): Array<number> {
    return this.Arr(number).fill(1);
  }
}
