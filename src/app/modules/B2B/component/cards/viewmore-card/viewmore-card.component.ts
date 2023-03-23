import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';


@Component({
  selector: 'app-viewmore-card',
  templateUrl: './viewmore-card.component.html',
  styleUrls: ['./viewmore-card.component.css'],
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
export class ViewmoreCardComponent implements OnInit {
  @Input() searchData: any;
  @Output() searchDataPressed = new EventEmitter();
  @ViewChild('name') searchElement: ElementRef;
  searchName: string = "";
  showInput: boolean = false;

  sliceLength: number = 3;
  constructor(
    private b2bService: B2bService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.searchName = this.searchData.searchName || "";
  }

  searchContactPressed(searchData) {
    this.searchDataPressed.emit(searchData);
  }

  handleShowMore() {
    if (this.sliceLength <= 3) {
      this.sliceLength = this.searchData.includedSearchChips.length;
    } else {
      this.sliceLength = 3;
    }
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

}
