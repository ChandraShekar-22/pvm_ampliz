import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  NgZone,
} from "@angular/core";
import { SaveSearchInput } from "../../../models/SaveSearch";
import { SearchCompanyInput } from "../../../models/SearchCompany";
import { SearchContactInput } from "../../../models/SearchContactModel";
import { B2bService } from "../../../services/b2b.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
@Component({
  selector: 'app-save-search-list',
  templateUrl: './save-search-list.component.html',
  styleUrls: ['./save-search-list.component.css']
})
export class SaveSearchListComponent implements OnInit {
  @Input() searchCred: SearchCompanyInput|SearchContactInput = new SearchContactInput();
  @Input() searchListDrawer: boolean = true;
  @Input() type: string = 'Contact';
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  searchSaved: EventEmitter<boolean> = new EventEmitter<boolean>();
  saveSearchName: any = '';
  constructor(
    private b2bService: B2bService,
    private messageService: MessageService,
    ) { }

  ngOnInit() {
  }

  closeDiv() {
    this.searchListDrawer = false;
    this.cancelBtnClick.emit(false);
  }
  saveList() {
    if(this.saveSearchName.length>0) {
      const body: SaveSearchInput = new SaveSearchInput(this.saveSearchName, this.searchCred);
      if(this.type === 'Contact') {
        this.b2bService.saveSearchContact(body).subscribe(res => {
          this.messageService.display(true,"Successfully saved this search","Saved Search");
          this.searchSaved.emit();
         },
         err => {
            this.messageService.displayError(true,"Failed to save");
         });
      } else {
        this.b2bService.saveSearchCompany(body).subscribe(res => {
          this.searchSaved.emit();
          this.messageService.display(true,"Successfully saved this search","Saved Search");
         },
         err => {
          this.messageService.displayError(true,"Failed to save");
         });
      }
       
    }
  }
  validateSaveSearch() {
    return (
      this.saveSearchName.length>0 
    );
  }
}
