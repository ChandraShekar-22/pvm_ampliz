import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('300ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('300ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class AlertBoxComponent implements OnInit {
  message: string = '';
  title: string = '';
  isError: boolean = false;
  alertMessages: Array<any> = [];

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.messageService.messageSource.subscribe(res => {
      this.message = res;
    });

    this.messageService.title.subscribe(res => {
      this.title = res;
    });
    this.messageService.isError.subscribe(isError => {
      // console.log(isError);
      this.isError = isError;
    });
    this.messageService.alertMessagesObserver.subscribe(res => {
      this.alertMessages = res;
    })
  }
  close(index){
    this.alertMessages.splice(index, 1);
  }

}
