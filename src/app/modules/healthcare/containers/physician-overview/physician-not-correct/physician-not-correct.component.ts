import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';

@Component({
  selector: 'app-physician-not-correct',
  templateUrl: './physician-not-correct.component.html',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
  styleUrls: ['./physician-not-correct.component.css'],
})
export class PhysicianNotCorrectComponent implements OnInit {
  showOtherTextField: boolean = false;
  notCorrectReasons: Array<any> = [
    'Name',
    'Title',
    'Hospital Name',
    'NPI Number',
    'State licence code',
    'Location',
    'Speciality',
  ];
  selectedReason: string = '';
  @Input() physicianId: any = '';
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  constructor(
    private amplizService: AmplizService,
    private loaderServe: LoaderService,
    private messageService: MessageService
  ) {}
  ngOnInit() {}

  otherClicked(event) {
    event.stopPropagation();
    this.showOtherTextField = true;
    this.selectedReason = '';
  }
  matMenuOpened() {
    this.showOtherTextField = false;
  }
  selectReason(reason: any) {
    if (reason !== '') {
      this.menuTrigger.closeMenu();
      this.loaderServe.display(true);
      this.selectedReason = reason;
      const body = {
        incorrectDataList: [reason],
        physicianId: this.physicianId,
      };
      this.amplizService
        .reportIncorrectPhysicianData(body.physicianId, body.incorrectDataList)
        .subscribe(
          (res) => {
            this.loaderServe.display(false);
            this.messageService.display(true, 'Updated the information');
          },
          (err) => {
            this.loaderServe.display(false);
            this.messageService.displayError(true, 'Error');
          }
        );
    }
  }
}
