import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { LTCService } from '../../../services/ltc.service';

@Component({
  selector: 'app-ltc-not-correct',
  templateUrl: './ltc-not-correct.component.html',
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
  styleUrls: ['./ltc-not-correct.component.css'],
})
export class LtcNotCorrectComponent implements OnInit {
  showOtherTextField: boolean = false;
  notCorrectReasons: Array<any> = ['Name of Center','Title','Department','Seniority','Name','LTC type','Location'];
  selectedReason: string = '';
  @Input() ltcId: any = '';
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  constructor(private b2bService: LTCService, private loaderServe: LoaderService,
    private messageService: MessageService
    ) { }
  ngOnInit() {
  }

  otherClicked(event) {
    event.stopPropagation();
    this.showOtherTextField = true;
    this.selectedReason = '';
  }
  matMenuOpened() {
    this.showOtherTextField = false;
  }
  selectReason(reason: any) {
    if(reason !=='') {
      this.menuTrigger.closeMenu();
    this.loaderServe.display(true);
    this.selectedReason = reason;
    const body = {
      incorrectDataList: [reason],
      ltcExecutiveId: this.ltcId
    }
    this.b2bService.reportDataNotCorrect(body).subscribe(res => {
      this.loaderServe.display(false);
      this.messageService.display(true,"Updated the information");
    },
    err => {
      this.loaderServe.display(false);
      this.messageService.displayError(true, "Error");
    })
  }
}

}
