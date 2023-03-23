import { Component, OnInit, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-low-credit-card',
  templateUrl: './low-credit-card.component.html',
  styleUrls: ['./low-credit-card.component.css']
})
export class LowCreditCardComponent implements OnInit {
  @Output() closeClicked = new EventEmitter<any>();
  @Output() getFreeClicked = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  handleCloseClick() {
    this.closeClicked.emit('');
  }


  handleGetFreeClick() {
    this.getFreeClicked.emit('');
  }

}
