import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SuccessmessageService {

  constructor() { }
  public statusActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public messageSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
  display(value: boolean, message = null) {
    if (message == null) {
      return;
    }
    this.statusActive.next(value);
    this.messageSource.next(message);
    setTimeout(() => {
      this.statusActive.next(false);
    }, 4000);
}


}
