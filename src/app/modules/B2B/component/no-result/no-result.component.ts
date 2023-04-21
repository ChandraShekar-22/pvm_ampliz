import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { SearchCompanyInput } from '../../models/SearchCompany';
import { SearchContactInput } from '../../models/SearchContactModel';
import { B2bService } from '../../services/b2b.service';
import { DataService } from '../../services/data.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.css'],
})
export class NoResultComponent implements OnInit {
  @Input() noResult: boolean = true;
  @Input() type: string = 'Contact';
  @Input() searchParams: SearchContactInput | SearchCompanyInput;
  @Output() filterApplied = new EventEmitter<any>();
  @Output() onFilterChange = new EventEmitter<any>();

  changedItems = [];
  showMore: boolean = true;
  sliceLength: number = 3;
  additionalForm = new UntypedFormGroup({
    additionalNote: new UntypedFormControl('', [Validators.required]),
  });
  constructor(
    private dataService: DataService,
    private b2bService: B2bService,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    // console.log(this.searchParams.getChangedItems(),"searchParams");
    this.changedItems = this.searchParams.getChangedItems();
  }
  handleShowMore() {
    if (this.showMore == true) {
      this.sliceLength = this.changedItems.length;
    } else {
      this.sliceLength = 3;
    }
    this.showMore = !this.showMore;
  }
  requestData() {
    // console.log(this.additionalForm.value);
    let body: any = {
      searchType: this.type,
      description: this.additionalForm.value.additionalNote,
      searchInputCompany: new SearchCompanyInput(),
      searchInputContact: new SearchContactInput(),
    };
    if (this.type == 'Contact') {
      body.serachInputContact = this.searchParams.toJson();
    } else {
      body.searchInputContact = this.searchParams.toJson();
    }
    this.additionalForm.reset();
    this.loaderService.display(true);
    this.b2bService.requestData(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.messageService.display(true, 'Successfully requested the data');
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  clearFilter() {
    if (this.type == 'Contact') {
      this.dataService.passSearchContactInput(new SearchContactInput(), false);
      this.filterApplied.emit(false);
      this.onFilterChange.emit(new SearchContactInput());
    } else {
      this.dataService.passSearchCompanyInput(new SearchCompanyInput(), false);
    }
  }
}
