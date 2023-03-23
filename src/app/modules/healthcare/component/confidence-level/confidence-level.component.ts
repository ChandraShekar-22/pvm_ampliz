import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-confidence-level',
  templateUrl: './confidence-level.component.html',
  styleUrls: ['./confidence-level.component.css']
})
export class ConfidenceLevelComponent implements OnInit {
  @Input() 
  emailStatus: number;
  @Output()
  addRange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  removeRange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
  ngOnInit(): void {
  }
  emitBtnValue(event: any) {
    if(event.source._checked) {
      this.addRange.emit(event)
    } else {
      this.removeRange.emit(event.value);
    }
  }
}
