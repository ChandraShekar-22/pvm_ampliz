import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/modules/healthcare/services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message = 'error';
  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorService.messageSource.subscribe(res => {
      this.message = res;
    });
  }

}
