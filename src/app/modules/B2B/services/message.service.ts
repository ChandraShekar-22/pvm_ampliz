import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor() { }
  public statusActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public messageSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public title: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public alertMessagesObserver: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  public alertMessages: Array<any> = [];
  display(value: boolean, message = null, title = null) {
    if (message == null) {
      return;
    }
    const body = {
      title: title,
      message: message,
      isError: false
    };
    this.statusActive.next(value);
    this.alertMessages.push(body);
    this.alertMessagesObserver.next(this.alertMessages);
    // this.statusActive.next(value);
    // this.messageSource.next(message);
    // this.title.next(title);
    // this.isError.next(false);
    setTimeout(() => {
      // this.statusActive.next(false);
      this.alertMessages.shift();
      this.alertMessagesObserver.next(this.alertMessages);
    }, 4000);
  }

  displayError(value: boolean, message = null, title = null) {
    if (message == null) {
      return;
    }
    const body = {
      title: title,
      message: message,
      isError: true
    };
    this.addToAlertMessages(body);
    setTimeout(() => {
					this.removeFromAlertMessages();
				}, 4000);
  }

  addToAlertMessages(body) {
    this.alertMessages.push(body);
    this.alertMessagesObserver.next(this.alertMessages);
  }

  removeFromAlertMessages() {
    this.alertMessages.shift();
    this.alertMessagesObserver.next(this.alertMessages);
  }

  changeAlertMessage(alertMessages) {
    this.alertMessages = alertMessages;
    this.alertMessagesObserver.next(alertMessages);
  }

}
