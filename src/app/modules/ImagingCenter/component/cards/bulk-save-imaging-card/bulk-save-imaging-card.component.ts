import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { ImagingService } from '../../../services/imaging.service';

@Component({
  selector: 'app-bulk-save-imaging-card',
  templateUrl: './bulk-save-imaging-card.component.html',
  styleUrls: ['./bulk-save-imaging-card.component.css']
})
export class BulkSaveImagingCardComponent implements OnInit {
  @Input() selectedImagings: Array<any> = [];
  @Input() selectedImagingsInCurrentPage: Array<any> = [];
  @Input() allImagingsSelected: Array<any> = [];
  @Input() totalItemCount = 0;
  @Input() selectedFilter: any = {};
  
  @Output() successfullyAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearPress: EventEmitter<any> = new EventEmitter<any>();
  constructor(private b2bService: ImagingService, private loaderService: LoaderService) { }

  ngOnInit() {
  }

  handleContactAddList() {
    this.successfullyAdded.emit();
  }
  handleClearPress() {
    this.clearPress.emit();
  }
  handleExportClick() {
    if(this.allImagingsSelected) {
      this.exportBulkToCsv();
    } else {
      this.exportToCsv();
    }
  }
  exportToCsv() {
    // const body = {
    //   contactIdList: this.selectedImagings
    // }
    // this.loaderService.display(true);
    // this.b2bService.exportToCsv(body).subscribe(res => {
    //   console.log(res);
    //   this.loaderService.display(false);
    //   const name = "contacts" + new Date().toISOString() + ".csv";
    //   this.b2bService.saveFile(res.body, name);
    //   this.successfullyAdded.emit();
    // }, err => {
    //   this.loaderService.display(false);
    // });
  }

  exportBulkToCsv() {
    // let body: any = {
    //   count: 5,
    //   searchInputContact: this.selectedFilter
    // };
    // this.loaderService.display(true);
    // this.b2bService.exportBulkToCsv(body).subscribe(res => {
    //   this.loaderService.display(false);
    //   this.successfullyAdded.emit();
    //   this.clearPress.emit();
    //   const name = "contacts" + new Date().toISOString() + ".csv";
    //   this.b2bService.saveFile(res.body, name);
    // },
    // err => {
    //   this.loaderService.display(false);
    // }
    // );
  }

}
