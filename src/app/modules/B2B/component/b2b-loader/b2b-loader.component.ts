import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-b2b-loader',
  templateUrl: './b2b-loader.component.html',
  styleUrls: ['./b2b-loader.component.css']
})
export class B2bLoaderComponent implements OnInit {
  @Input() loopCount = 10;
  Arr = Array; //Array type captured in a variable
  constructor() { }

  ngOnInit() {
  }

  numSequence(number: number): Array<number> {
    return this.Arr(number).fill(1)
  }
}
