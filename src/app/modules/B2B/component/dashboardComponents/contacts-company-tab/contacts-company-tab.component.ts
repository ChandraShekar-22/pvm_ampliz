import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { ThemePalette } from '@angular/material';

@Component({
  selector: 'app-contacts-company-tab',
  templateUrl: './contacts-company-tab.component.html',
  styleUrls: ['./contacts-company-tab.component.css']
})
export class ContactsCompanyTabComponent implements OnInit {
  links = ['Contacts', 'Companies'];
  @Input() activeLink = this.links[0];
  background = "#ffffff";
  @Output() tabChanged = new EventEmitter(); 
  constructor() { }

  ngOnInit() {
  }
  handleTabChange(link) {
    this.tabChanged.emit(link);
  }

}
