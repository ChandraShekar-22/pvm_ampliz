import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Search } from 'angular-feather/icons';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.css']
})
export class OtpInputComponent implements OnInit {

  valueArray = ['','','',''];
  @Output() otpChange: EventEmitter<any> = new EventEmitter();
  @Input() otp: string;

  constructor() { }

  ngOnInit() {
  }


  moveToNext(e: any, prev: any, curr: any, next: any) {
    // console.log("line18", this.valueArray)
    this.otpChange.emit(this.valueArray.join(""));
    let length = curr.value.length;
    let maxLength = curr.getAttribute('maxlength');
    if (length == maxLength) {
      if (next != "") {
        next.focus();
      }
    }
    if (e.key == "Backspace") {
      if (prev != "") {
        prev.focus();
      }
    }
  }

}
