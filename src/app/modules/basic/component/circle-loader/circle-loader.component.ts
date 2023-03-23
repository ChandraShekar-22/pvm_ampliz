import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-loader',
  templateUrl: './circle-loader.component.html',
  styleUrls: ['./circle-loader.component.css']
})
export class CircleLoaderComponent implements OnInit {
  @Input() radius: number = 10;
  @Input() strokeWidth: number = 2;
  constructor() { }

  ngOnInit() {
  }

}
