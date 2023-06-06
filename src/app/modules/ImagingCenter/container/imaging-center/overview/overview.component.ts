import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagingService } from '../../../services/imaging.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  executiveTableHeader: any = [
    {
      key: 'fullname',
      name: 'Executive Name',
      type: 'text',
      isLink: true,
    },
    {
      key: 'title',
      name: 'Title',
      type: 'text',
    },
    {
      key: 'email',
      name: 'Email Address',
      type: 'text',
    },
  ];
  loadExecutive: boolean = false;
  executiveList: any = [];
  paramsData: any;
  showButtonLoader: boolean = false;
  imagingCenterDetails: any = {
    imagingCenterId: '',
    centerName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phoneNumber: [],
    web_Address: '',
    noOfExecutive: 0,
  };
  imagingOverviewData: any;
  imagingMoreInfoData: any;
  isOverviewAvailable: boolean = true;
  isMoreInfoAvailable: boolean = true;
  showSaveButton: boolean = false;
  saveDrawer: boolean = false;
  notCorrectDrawer: boolean = false;
  notCorrectReasons: Array<any> = ['Center name', 'Imaging equipments', 'Location'];
  DataResult: Array<any> = [];
  currentCredit: any = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imagingService: ImagingService,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private amplizService: AmplizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramsData = this.activatedRoute.snapshot.params['ImagingCenterId'];
    this.getImaginCenterDetails();
    this.getImagingCenterOverviewData();
    this.getExecutives();
    // this.getImagingMoreInfoData();
  }
  getExecutives() {
    this.imagingService.getExecutivesOfImagingCenter(this.paramsData, 0, 200).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.executiveList = res.icExecutiveDetailList;
        this.loadExecutive = true;
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  getImaginCenterDetails() {
    alert(`${JSON.stringify(this.paramsData)}`);
    this.imagingService.imagingGetImagingCenterDetails(this.paramsData).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.imagingCenterDetails = res.imagingCenterInfo;
        // if (res.imagingCenterInfo.leadSaveStatus !== "Saved") {
        //   this.showSaveButton = true;
        // } else {
        //   this.showSaveButton = false;
        // }
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  getImagingCenterOverviewData() {
    this.imagingService.getOverviewOfImagingCenter(this.paramsData).subscribe((res) => {
      this.imagingOverviewData = res.imagingCenterMoreInfo;
      const keys = Object.keys(res.imagingCenterMoreInfo);
      this.isOverviewAvailable = true;
      keys.forEach((item) => {
        if (
          !this.imagingOverviewData[item] ||
          this.imagingOverviewData[item] == '' ||
          this.imagingOverviewData[item] == null
        ) {
          delete this.imagingOverviewData[item];
        }
      });
      if (Object.keys(this.imagingOverviewData).length == 0) {
        this.isOverviewAvailable = false;
      }
    });
  }
  getImagingMoreInfoData() {
    this.imagingService.getImagingCenterMoreInfo(this.paramsData).subscribe((res) => {
      this.imagingMoreInfoData = res.imagingCenterMoreInfo;
      const keys = Object.keys(res.imagingCenterMoreInfo);
      this.isMoreInfoAvailable = true;

      keys.forEach((item) => {
        if (
          !this.imagingMoreInfoData[item] ||
          this.imagingMoreInfoData[item] == '' ||
          this.imagingMoreInfoData[item] == null
        ) {
          delete this.imagingMoreInfoData[item];
        }
      });
      if (Object.keys(this.imagingMoreInfoData).length == 0) {
        this.isMoreInfoAvailable = false;
      }
    });
  }
  // get showSaveButton() {
  //        return this.imagingCenterDetails.leadSaveStatus !== "Saved";
  // }
  get saveButtonText() {
    return this.imagingCenterDetails.leadSaveStatus == 'NotSaved' ? 'View' : 'Save';
  }
  viewImagingCenterFromList() {
    const body = {
      icExecutiveId: this.imagingCenterDetails.icExecutiveId,
    };
    this.showButtonLoader = true;
    this.imagingService.viewImagingFromList(body).subscribe(
      (res) => {
        this.messageService.display(true, 'Successfully added to the list');
        this.imagingService.getImagingCenterDetails(this.imagingCenterDetails.icExecutiveId).subscribe(
          (overview) => {
            this.showButtonLoader = false;
            this.imagingCenterDetails = overview.imagingCenterInfo;
            if (overview.imagingCenterInfo.leadSaveStatus !== 'Saved') {
              this.showSaveButton = true;
            }
          },
          (err) => {
            this.showButtonLoader = false;
          }
        );
      },
      (err) => {
        this.showButtonLoader = false;
      }
    );
  }
  handleSaveButtonPress() {
    const leadSaveStatus = this.imagingCenterDetails.leadSaveStatus;
    if (leadSaveStatus == 'NotSaved') {
      this.viewImagingCenterFromList();
    } else {
      this.saveDrawer = true;
    }
  }
  cancelBtnClick(value: boolean) {
    this.saveDrawer = value;
    this.notCorrectDrawer = value;
  }
  refreshedData(ev: any) {
    if (ev === true) {
      this.loaderService.display(true);
      setTimeout(() => {
        this.getImaginCenterDetails();
      }, 200);
    }
  }
  request(request: any) {
    this.loaderService.display(true);
    const body = {
      comid: '0',
      url: window.location.href,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.messageService.display(true, res.msg);
      },
      (err) => {
        this.loaderService.display(true);
      }
    );
  }
  tabClick(event) {}
  get location() {
    let loc = [];
    if (this.imagingCenterDetails.address != '') {
      loc.push(this.imagingCenterDetails.address);
    }
    if (this.imagingCenterDetails.city != '') {
      loc.push(this.imagingCenterDetails.city);
    }
    if (this.imagingCenterDetails.state != '') {
      loc.push(this.imagingCenterDetails.state);
    }
    if (this.imagingCenterDetails.country != '') {
      loc.push(this.imagingCenterDetails.country);
    }
    return loc.join(', ');
  }

  executiveNamePressed(event: any = {}) {
    const icExecutiveId = event.value.icExecutiveId;
    this.router.navigate([]).then((result) => {
      window.open(`imaging/${icExecutiveId}`, '_blank');
    });
  }
}
