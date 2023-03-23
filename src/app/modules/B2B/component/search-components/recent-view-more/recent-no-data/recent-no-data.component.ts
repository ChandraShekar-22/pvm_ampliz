import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";

@Component({
  selector: 'app-recent-no-data',
  templateUrl: './recent-no-data.component.html',
  styleUrls: ['./recent-no-data.component.css']
})
export class RecentNoDataComponent implements OnInit {
  @Input() recentViewMore: boolean = true;
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }
 cancelSaveDiv() {
    this.recentViewMore = false;
    setTimeout(() => {
      this.cancelBtnClick.emit(false);
    }, 300);
  }
}
