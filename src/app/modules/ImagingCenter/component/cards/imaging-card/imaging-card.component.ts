import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { SearchImagingExecutivesModel } from '../../../models/SearchImagingExecutivesModel';
import { SearchImagingModel } from '../../../models/SearchImagingModel';
import { ImagingDataService } from '../../../services/imaging-data.service';
import { ImagingService } from '../../../services/imaging.service';
@Component({
  selector: 'app-imaging-card',
  templateUrl: './imaging-card.component.html',
  styleUrls: ['./imaging-card.component.css'],
})
export class ImagingCardComponent implements OnInit {
  @Input() imagingInfo: any;
  b2bSaveDrawer: boolean = false;
  showMore: boolean = true;
  sliceLength: number = 5;
  industryAndSkillset: Array<string> = [];
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;

  constructor(
    private dataService: ImagingDataService,
    private router: Router,
    private imagingService: ImagingService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getIndustryAndSkillset();
    this.resetSliceLength();
  }

  get showSaveButton() {
    return this.imagingInfo.leadSaveStatus !== 'Saved';
  }
  get isSaveButton() {
    return this.imagingInfo.leadSaveStatus == 'Viewed';
  }

  resetSliceLength() {
    if (window.screen.availWidth < 1300) {
      this.sliceLength = 3;
    } else {
      this.sliceLength = 5;
    }
  }
  getIndustryAndSkillset() {
    const industryList = this.imagingInfo.industryList || [];
    const skillList = this.imagingInfo.skillList || [];
    this.industryAndSkillset = [...industryList, ...skillList];
  }
  invokeSaveList() {
    // console.log("save clicked")
    this.b2bSaveDrawer = true;
    // console.log(this.b2bSaveDrawer )
  }

  handleShowMore() {
    if (this.showMore == true) {
      this.sliceLength = this.imagingInfo.skillList.length;
    } else {
      this.resetSliceLength();
    }
    this.showMore = !this.showMore;
  }

  openUrl(type) {
    const url = this.imagingInfo[type];
    if (url !== '') {
      window.open('https://' + url, 'popUpWindow');
    }
  }

  cancelBtnClick(value: boolean) {
    this.b2bSaveDrawer = value;
  }

  handleCheckboxChange(event) {
    this.checkboxChange.emit(this.checkboxSelected);
  }
  doSearchImaging(key: string, skill: any) {
    const imagingObj: SearchImagingExecutivesModel = new SearchImagingExecutivesModel();
    imagingObj[key] = [skill];
    this.dataService.passSearchImagingInput(imagingObj);
  }
  onImagingNameClicked(iv) {
    if (iv.icExecutiveId !== null && iv.icExecutiveId !== undefined) {
      if (this.imagingInfo.leadSaveStatus === 'NotSaved') {
        this.viewContactAndOpen(iv.icExecutiveId);
      } else {
        this.router.navigate([]).then((result) => {
          window.open(`imagingOverview/${iv.icExecutiveId}`, '_blank');
        });
      }
    }
  }

  viewContactAndOpen(icExecutiveId: any) {
    const body = {
      icExecutiveId,
    };
    this.loaderService.display(true);
    this.imagingService.viewImagingFromList(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.imagingService.getImagingCenterDetails(icExecutiveId).subscribe((overview) => {
          this.dataService.addToSavedContacts([overview.imagingCenterExecutiveInfo]);
          this.router.navigate([]).then((result) => {
            window.open(`imagingOverview/${icExecutiveId}`, '_blank');
          });
        });
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  get location() {
    let loc = [];
    if (this.imagingInfo.address != '' && this.imagingInfo.address) {
      loc.push(this.imagingInfo.address);
    }
    if (this.imagingInfo.city != '') {
      loc.push(this.imagingInfo.city);
    }
    if (this.imagingInfo.state != '') {
      loc.push(this.imagingInfo.state);
    }
    if (this.imagingInfo.country != '') {
      loc.push(this.imagingInfo.country);
    }
    return loc.join(', ');
  }
}
