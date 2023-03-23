import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../B2B/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor(private messageService: MessageService, private router: Router) { }

  public displayError(error: HttpErrorResponse) {
    if (error.status === 404) {
      this.messageService.displayError(true, "Api not found");
    }
    else if(error.status === 401){
      this.messageService.displayError(true, "Authorization expired");
    }
    else {
      if (error.error&&Array.isArray(error.error)) {
        error.error.map(itm => {
          this.messageService.displayError(true, itm.message);
        })
      } else {
        this.messageService.displayError(true, "Server Error");
      }
    }
  }
}
