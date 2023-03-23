import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-ampliz-menu-button',
  templateUrl: './ampliz-menu-button.component.html',
  styleUrls: ['./ampliz-menu-button.component.css']
})
export class AmplizMenuButtonComponent implements OnInit {
  @Input() title: string = "Save";
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';
  @Input() itemText: string;
  @Input() itemValue: string;
  @Input() type: string = "outline";
  @Input() iconName: string = "more_horiz";
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  constructor() { }

  ngOnInit() {
  }

  get optionOnScreen() {
    const filteredOptions = this.options.filter(item => {
      if (this.itemValue) {
        return item[this.itemValue] === this.selectedOption;
      } else {
        return item === this.selectedOption;
      }
    });
    return filteredOptions[0];
  }

  activeOption(option): Boolean {
    if (this.itemValue) {
      return this.selectedOption === option[this.itemValue];
    } else {
      return this.selectedOption === option;
    }

  }



  handleOptionSelected(option) {
    let opt: any = option;
    if (this.itemValue) {
      opt = option[this.itemValue];
    }
    this.optionSelected.emit(opt);
  }

}
