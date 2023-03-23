import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.css'],
  animations: [
    trigger(
      'widthAnimation', [
      transition(':enter', [
        style({ width:'0px', opacity:0  }),
        animate('300ms', style({ width:'300px',opacity:1 }))
      ]),
      transition(':leave', [
        style({ width:'300px' ,opacity:1 }),
        animate('300ms', style({ width:'0px',opacity:0 }))
      ])
    ]
    )
  ],
})
export class ShareButtonComponent implements OnInit {
  showShareModal: boolean=false;
  sharableLink: any = 'ampliz.com/sharelink';
  @ViewChild("tooltip") tooltip: any ;
  constructor() { }

  ngOnInit() {
  }

  copySharableLink() {
    this.tooltip.show();
    setTimeout(() => {
      this.tooltip.hide();
    }, 2000);
    navigator.clipboard.writeText(this.sharableLink );
  }

}
