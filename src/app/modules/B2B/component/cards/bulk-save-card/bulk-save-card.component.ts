import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';

@Component({
  selector: 'app-bulk-save-card',
  templateUrl: './bulk-save-card.component.html',
  styleUrls: ['./bulk-save-card.component.css']
})
export class BulkSaveCardComponent implements OnInit {
  @Input() selectedContacts: Array<any> = [];
  @Input() selectedContactsInCurrentPage: Array<any> = [];
  @Input() allContactsSelected: Array<any> = [];
  @Input() totalItemCount = 0;
  @Input() selectedFilter: any = {};
  
  @Output() successfullyAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearPress: EventEmitter<any> = new EventEmitter<any>();
  constructor(private b2bService: B2bService, private loaderService: LoaderService) { }

  ngOnInit() {
  }

  handleContactAddList() {
    this.successfullyAdded.emit();
  }
  handleClearPress() {
    this.clearPress.emit();
  }
  handleExportClick() {
    if(this.allContactsSelected) {
      this.exportBulkToCsv();
    } else {
      this.exportToCsv();
    }
  }
  exportToCsv() {
    const body = {
      contactIdList: this.selectedContacts
    }
    this.loaderService.display(true);
    this.b2bService.exportToCsv(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        const name = "contacts" + new Date().toISOString() + ".csv";
        this.b2bService.saveFile(res.body, name);
        this.successfullyAdded.emit();
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  exportBulkToCsv() {
    let body: any = {
      count: 5,
      searchInputContact: this.selectedFilter
    };
    this.loaderService.display(true);
    this.b2bService.exportBulkToCsv(body).subscribe(res => {
      this.loaderService.display(false);
      this.successfullyAdded.emit();
      this.clearPress.emit();
      const name = "contacts" + new Date().toISOString() + ".csv";
      this.b2bService.saveFile(res.body, name);
    },
    err => {
      this.loaderService.display(false);
    }
    );
  }
}
