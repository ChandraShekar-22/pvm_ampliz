import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-card',
  templateUrl: './common-card.component.html',
  styleUrls: ['./common-card.component.css']
})
export class CommonCardComponent implements OnInit {

  @Input() title = 'Email';
  @Input() count = 192838;
  constructor() { }

  ngOnInit() {
  }

}
