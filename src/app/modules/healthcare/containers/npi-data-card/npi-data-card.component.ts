import { Component, OnInit } from '@angular/core';
import { AmplizService } from '../../services/ampliz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-npi-data-card',
  templateUrl: './npi-data-card.component.html',
  styleUrls: ['./npi-data-card.component.css'],
})
export class NpiDataCardComponent implements OnInit {
  emailCount = 0;
  phoneCount = 0;
  bulkNpiId = '';
  specialityList: { speciality: string; count: string }[] = [];
  stateList: { state: string; count: string }[] = [];
  cityList: { city: string; count: string }[] = [];
  specialityLoading: boolean = false;
  stateListLoading: boolean = false;
  cityListLoading: boolean = false;
  showProgressModal: boolean = false;
  emailDropDownOptions = [
    { name: 'Show all', value: 'all' },
    { name: 'With emails', value: 'withemail' },
    { name: 'Without email', value: 'withoutemail' },
  ];
  phoneDropDownOptions = [
    { name: 'Show all', value: 'all' },
    { name: 'With phone', value: 'withphone' },
    { name: 'Without phone', value: 'withoutphone' },
  ];
  emailFilter: string = 'all';
  phoneFilter: string = 'all';
  specialityFilter: string = 'all';
  stateFilter: string = 'all';
  cityFilter: string = 'all';
  downloadModal: boolean = false;
  emailLoading: boolean = false;
  phoneLoading: boolean = false;
  reportInfo: any = {
    fileName: '',
    noOfContactAccepted: 0,
    noOfContactRejected: 0,
    noOfContactUploaded: 0,
  };
  constructor(private amplizService: AmplizService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.bulkNpiId = res.bulkNpiId;
    });
    this.bulkIdStatus();
  }
  bulkIdStatus() {
    this.amplizService.npiReportStatus(this.bulkNpiId).subscribe((res: any) => {
      if (res.matchingStatus === 'Matching completed') {
        this.getDashboardDetails();
        this.getEmailCount();
        this.getPhoneCount();
        this.getStateList();
        this.getCityList();
        this.getSpecilityList();
        this.getReportSummary();
        this.showProgressModal = false;
      } else {
        this.showProgressModal = true;
        this.specialityLoading = true;
        this.stateListLoading = true;
        this.cityListLoading = true;
        this.phoneLoading = true;
        this.emailLoading = true;
        this.getReportSummary();
      }
    });
  }
  getReportSummary() {
    this.amplizService.npiReportSummary(this.bulkNpiId).subscribe((res) => {
      this.reportInfo = res;
    });
  }
  get currentCredits() {
    return localStorage.getItem('credits') || 0;
  }

  getEmailCount() {
    this.emailLoading = true;
    this.amplizService.getEmailCountForNPI(this.bulkNpiId, this.emailFilter).subscribe(
      (res) => {
        this.emailLoading = false;
        this.emailCount = res.count;
      },
      (error) => {
        this.emailLoading = false;
      }
    );
  }
  bookDemo() {
    window.open(
      'https://www.ampliz.com/book-your-demo?utm_source=npi_lookup_enric&utm_medium=banner&utm_campaign=product',
      '_blank'
    );
  }
  get disableDownload() {
    return this.currentCredits === 0;
  }
  getPhoneCount() {
    this.phoneLoading = true;
    this.amplizService.getPhoneCountForNPI(this.bulkNpiId, this.phoneFilter).subscribe(
      (res) => {
        this.phoneLoading = false;
        this.phoneCount = res.count;
      },
      (error) => {
        this.phoneLoading = false;
      }
    );
  }
  openDownloadModel(event) {
    if (!this.disableDownload) {
      this.downloadModal = event;
    }
  }
  getStateList() {
    this.stateListLoading = true;
    this.amplizService.getStateListNPI(this.bulkNpiId, this.stateFilter).subscribe(
      (res) => {
        this.stateListLoading = false;
        this.stateList = res.stateGroupByCountList;
      },
      (error) => {
        this.stateListLoading = false;
      }
    );
  }
  getCityList() {
    this.cityListLoading = true;
    this.amplizService.getCityListNPI(this.bulkNpiId, this.cityFilter).subscribe(
      (res) => {
        this.cityListLoading = false;
        this.cityList = res.cityGroupByCountList;
      },
      (error) => {
        this.cityListLoading = false;
      }
    );
  }
  getSpecilityList() {
    this.specialityLoading = true;
    this.amplizService.getSpecialityListNPI(this.bulkNpiId, this.specialityFilter).subscribe(
      (res) => {
        this.specialityLoading = false;
        this.specialityList = res.specilityRecordCountList;
      },
      (error) => {
        this.specialityLoading = false;
      }
    );
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem('auth_token');
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem('refresh_token');
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          localStorage.setItem('credits', res.CurrentCredits);
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
        }
      );
    } else {
      this.amplizService.logout();
    }
  }
  onFilterChange(e: any, key) {
    switch (key) {
      case 'speciality':
        this.specialityFilter = e;
        this.getSpecilityList();
        break;
      case 'emailCount':
        this.emailFilter = e;
        this.getEmailCount();
        break;
      case 'phoneCount':
        this.phoneFilter = e;
        this.getPhoneCount();
        break;
      case 'state':
        this.stateFilter = e;
        this.getStateList();
        break;
      case 'city':
        this.cityFilter = e;
        this.getCityList();
        break;
    }
  }
}
