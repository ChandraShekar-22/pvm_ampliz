import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recent-viewmore-card',
  templateUrl: './recent-viewmore-card.component.html',
  styleUrls: ['./recent-viewmore-card.component.css']
})
export class RecentViewmoreCardComponent implements OnInit {
  @Input() searchData: any;
  @Output() searchDataPressed = new EventEmitter();
  @Output() saveSearchPressed = new EventEmitter();
  
  searchType: string = 'companySearchParams';

  sliceLength: number = 3;
  constructor() { }

  ngOnInit() {
    // console.log(this.searchData,"Search dat is")
    if(this.searchData.searchType =='Contact') {
      this.searchType = "contactSearchParams";
    } else {
      this.searchType = "companySearchParams";
    }
  }

  searchContactPressed(searchData) {
    this.searchDataPressed.emit(searchData);
  }

  handleShowMore() {
    
    if(this.sliceLength<=3) {
      this.sliceLength=this.searchData.includedSearchChips.length;
    } else {
      this.sliceLength = 3;
    }
  }
  handleSave() {
    this.saveSearchPressed.emit(this.searchData);
  }
}
