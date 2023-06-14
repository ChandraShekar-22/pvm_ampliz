import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  animations: [
    trigger('inputAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class MemberCardComponent implements OnInit {
  isExpanded: boolean = false;
  classN: string = 'active';

  constructor() {}

  ngOnInit(): void {}

  rotateIcon() {
    this.isExpanded = !this.isExpanded;
  }
}
