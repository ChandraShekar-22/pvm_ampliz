import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SearchCompanyInput } from 'src/app/modules/B2B/models/SearchCompany';
import { SearchContactInput } from 'src/app/modules/B2B/models/SearchContactModel';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
  selector: 'app-save-search-card',
  templateUrl: './save-search-card.component.html',
  styleUrls: ['./save-search-card.component.css'],
  animations: [
    trigger(
      'inputAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    ),
    trigger(
      'nameAnimation', [
      transition(':enter', [
        style({ opacity: 0, }),
        animate('200ms', style({ opacity: 1, }))
      ])
    ]
    )
  ]
})
export class SaveSearchCardComponent implements OnInit {
  @Input() searchData: any;
  searchName: string = "";
  showInput: boolean = false;
  searchContactInput: SearchContactInput = new SearchContactInput();
  searchCompanyInput: SearchCompanyInput = new SearchCompanyInput();
  @ViewChild('name') searchElement: ElementRef;
  constructor(
    private b2bService:B2bService,
    private dataService: DataService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.searchName = this.searchData.searchName;
  }

  handleRenameClick() {
    this.showInput = true;
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 0);
  }
  handleInputCancel() {
    this.showInput = false;
    this.searchName = this.searchData.searchName || "";
  }

  handleChangeNameClicked(event) {
    this.showInput = false;
    this.updateName();
  }

  updateName() {
    // console.log(this.searchData);
    if (this.searchName !== this.searchData.searchName && this.searchName !== '') {
      const body = {
        savedserachId: this.searchData.savedSearchId,
        searchName: this.searchName
      };
      this.b2bService.renameSavedSearchContact(body).subscribe(res => {
        this.searchData.searchName = this.searchName;
        this.messageService.display(true, "Successfully Renamed");
      },
        err => {
          this.searchName = this.searchData.searchName;
          this.messageService.displayError(true, "Error while renaming");
        });
    } else {
      this.searchName = this.searchData.searchName;
    }
  }

  makeSearch() {
    // console.log(this.searchData.savedSearchType);
    // this.dataService.searchOrRecentTapped(true);
    if (this.searchData.savedSearchType == "Contact") {
      const contactObj = this.searchContactInput.fromJson(this.searchData);
      this.dataService.passSearchContactInput(contactObj);
      this.dataService.changeSelectedTab(0);
    } else {
      const companyObj = this.searchCompanyInput.fromJson(this.searchData);
      this.dataService.passSearchCompanyInput(companyObj);
      this.dataService.changeSelectedTab(1);
    }
    this.dataService.makeSavesearchVisible(false);
    this.dataService.makeRecentsearchVisible(false);
  }


}
