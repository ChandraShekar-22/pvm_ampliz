import { Component, OnInit } from '@angular/core';
import { SuccessmessageService } from '../../../../healthcare/services/successmessage.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  message: string;
  showAlert: boolean = false;
  constructor(
    private successMessage: SuccessmessageService
  ) { }

  ngOnInit() {
    this.successMessage.messageSource.subscribe(res => {
      this.message = res;
    });
  }

}
