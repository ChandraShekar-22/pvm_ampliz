import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-inline-alert',
  templateUrl: './inline-alert.component.html',
  styleUrls: ['./inline-alert.component.css']
})
export class InlineAlertComponent implements OnInit, AfterViewInit {
  @Input() border: boolean = true;
  @Input() success: boolean = false;
  @Input() hasError: boolean = true;
  @Input() row: boolean = true;
  @Input() content: any = {heading:"", subHeading:""};
  // @Input() callbackFunction: (args: any) => void;
  @Output("callbackFunction") callbackFunction: EventEmitter<any> = new EventEmitter();
  componentHeading: string = this.content.heading;
  componentSubHeading: string =this.content.subHeading;
  timer;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.timer = 
    setTimeout(() => {
      this.componentHeading = this.content.heading;
      this.componentSubHeading =this.content.subHeading;
      clearTimeout(this.timer);
    });
      
  }
  callBack(args: any = null){
    this.callbackFunction.emit();
  }
}
