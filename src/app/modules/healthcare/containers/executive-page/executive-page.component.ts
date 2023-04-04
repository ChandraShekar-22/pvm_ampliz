import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { SkeletonloaderService } from 'src/app/modules/healthcare/services/skeletonloader.service';
import { ErrorService } from 'src/app/modules/healthcare/services/error.service';

import { PaginationService } from '../../services/pagination.service';
import 'rxjs/Rx';
import { MessageService } from '../../../B2B/services/message.service';
import { FilterStorageService } from '../../services/filter-storage.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-executive-page',
  templateUrl: './executive-page.component.html',
  styleUrls: ['./executive-page.component.css'],
})
export class ExecutivePageComponent implements OnInit, AfterViewInit {
  subscribed: boolean;
  currentCredit: any;
  tab = 1;
  executiveSearchParameter: any = {};
  offset: number = 0;
  limit: number = 5;
  leadWithEmail: boolean = false;
  leadWithPhone: boolean = false;
  searchType: string;
  searchResult: any;
  totalSearchResult: any = [];
  netNewCount: number;
  totalCount: number;
  totalSize: any;
  pager: any = {};
  pagedItems: any;
  filterParams: any = {};
  page: any;
  subscriptions = [];
  filterChangeOmitted: boolean = false;
  headerData: any = '';
  noResult: boolean = false;
  unLockDiv: boolean = false;
  showLoader: boolean = true;
  extotalCount: any;
  clientIp: any = '';
  selectedExecutive: Array<string> = [];
  selectedExecutiveInCurrentPage: Array<any> = [];
  pageNumberOptions: Array<any> = [5, 10, 20, 50];
  isSpecialityUser: boolean = false;
  previousOffsets: Array<any> = [0];
  previousSavedOffsets: Array<any> = [0];
  savedExecutives: Array<any> = [];
  bulkSaveParams: any = {};
  constructor(
    public amplizService: AmplizService,
    private loaderService: SkeletonloaderService,
    private errorService: ErrorService,
    private messageService: MessageService,
    private pagerservice: PaginationService,
    private filterStorageService: FilterStorageService,
    private dataService: DataService
  ) {}

  get subscriptionType() {
    return localStorage.getItem('SubscriptionisActive');
  }

  get isPaid() {
    return this.subscribed;
    // return true;
  }

  ngOnInit() {
    // this.getIPAddress();
    this.getDashboardDetails();
    this.getPersistData();
    this.saveDraftLeads();
    setTimeout(() => {
      this.isSpecialityUser =
        localStorage.getItem('is_SpecialityUser') == 'true' ? true : false;
    }, 10);
    this.unmaskSavedExecutive();
  }

  saveDraftLeads() {
    this.amplizService.saveDraftLeads().subscribe(
      (res) => {},
      (err) => {}
    );
  }

  unmaskSavedExecutive() {
    this.dataService.savedExecutives.subscribe((res: Array<any>) => {
      res.map((savedExecutive: any) => {
        if (res.length > 0) {
          this.getNetNewCount();
        }
        const index = this.totalSearchResult.findIndex(
          (executiveItem) =>
            savedExecutive.executiveId == executiveItem.executiveId
        );
        if (index !== -1) {
          this.totalSearchResult[index].phoneNumber =
            savedExecutive.phoneNumber;
          this.totalSearchResult[index].email = savedExecutive.emailAddress;
          this.totalSearchResult[index].leadSaveStatus =
            savedExecutive.leadSaveStatus;
        }
      });
      // this.contactsList.updateContactsListFromSavedList(res);
    });
  }
  ngAfterViewInit() {
    if (!this.filterChangeOmitted) {
      this.setPage(1);
    }
  }
  // getIPAddress() {
  //   this.amplizService.getIpAddress().subscribe(res => {
  //     console.log(res);
  //     this.clientIp = res.ip||'';
  //   },(err: any) => {

  //   });
  // }
  filterChanged(event: any) {
    this.filterChangeOmitted = true;
    this.filterParams.fullName = event.fullName;
    this.filterParams.hospitalNameList = event.hospitalNameList;
    this.filterParams.titleInclude = event.titleInclude;
    this.filterParams.titleExclude = event.titleExclude;
    this.filterParams.levelID = event.levelID.map((level) => level.id);
    this.filterParams.department = event.department;
    if (event.city) {
      this.filterParams.city = event.city.map((city) => city.city);
    }
    if (event.stateList) {
      this.filterParams.stateList = event.stateList.map((state) => state.state);
    }
    // this.setPage(1);
    if (event.cleared) {
      this.setPage(1);
      this.leadWithEmail = false;
      this.leadWithPhone = false;
    } else {
      // this.setPage(1);

      this.getExecutiveSearchData();
      // this.getNetNewCount();
      this.resetSelectedExecutive();
    }
  }
  async getDashboardDetails() {
    setTimeout(() => {
      this.loaderService.status.subscribe((res) => {
        //
        this.showLoader = res;
      });
    });

    const authToken = await localStorage.getItem('auth_token');
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem('refresh_token');
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.currentCredit = res.CurrentCredits;
          //
          this.subscriptions = res.Subscriptions;
          if (this.subscriptions[0].SubscriptionType == 'Free') {
            localStorage.setItem('SubscriptionisActive', 'false');
            this.subscribed = false;

            this.headerData = 'Request Pricing';
          }
          if (this.subscriptions[0].SubscriptionType == 'Paid') {
            localStorage.setItem('SubscriptionisActive', 'true');
            this.subscribed = true;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
          //
        }
      );
    } else {
      this.amplizService.logout();
    }
  }

  getNetNewCount() {
    this.executiveSearchParameter.offset =
      this.previousOffsets[this.previousOffsets.length - 1];
    this.executiveSearchParameter.savedListOffset =
      this.previousSavedOffsets[this.previousSavedOffsets.length - 1];
    this.executiveSearchParameter.limit = this.limit;
    this.executiveSearchParameter.leadWithEmail = this.leadWithEmail;
    this.executiveSearchParameter.leadWithPhone = this.leadWithPhone;
    this.executiveSearchParameter.searchType = 'NETNEW';

    this.amplizService
      .getExecutiveNetNewCount(this.executiveSearchParameter, this.filterParams)
      .subscribe((res) => {
        this.netNewCount = res.netNew;
        this.totalSize = 0;
        if (this.tab === 1) {
          this.totalSize = this.extotalCount;
        } else {
          this.totalSize = this.netNewCount;
        }
      });
  }

  getExecutiveSearchData() {
    this.previousOffsets = [0];
    this.offset = 0;
    this.loaderService.display(true);
    this.executiveSearchParameter.offset =
      this.previousOffsets[this.previousOffsets.length - 1];
    this.executiveSearchParameter.savedListOffset =
      this.previousSavedOffsets[this.previousSavedOffsets.length - 1];

    this.executiveSearchParameter.limit = this.limit;
    this.executiveSearchParameter.leadWithEmail = this.leadWithEmail;
    this.executiveSearchParameter.leadWithPhone = this.leadWithPhone;
    // this.executiveSearchParameter.clientIp = this.clientIp;
    this.executiveSearchParameter.searchType =
      this.tab === 1 ? 'TOTAL' : 'NETNEW';
    this.bulkSaveParams = {
      ...this.executiveSearchParameter,
      ...this.filterParams,
    };
    this.amplizService
      .searchExecutive(this.executiveSearchParameter, this.filterParams)
      .subscribe((res) => {
        this.getNetNewCount();
        this.searchResult = res;
        this.totalSearchResult = res.healthExecutiveInfoList || [];
        // this.netNewCount = res.netNew;
        this.totalCount = res.totalResult;
        if (this.totalSearchResult.length != 0) {
          this.noResult = false;
          this.extotalCount = res.totalResult;
          this.totalCount = res.totalResult;
          this.previousOffsets.push(res.offset);
          this.previousSavedOffsets.push(res.savedListOffset);
          // this.netNewCount = res.netNew;
          this.totalSize = this.tab === 1 ? res.totalResult : res.netNew;
          //
          this.pager = this.pagerservice.getPager(
            this.totalSize,
            this.page,
            this.limit
          );
          this.pagedItems = this.totalSearchResult.slice(
            this.pager.startIndex,
            this.pager.endIndex + 1
          );
          this.getSelectedExecutivesInCurrentPage();
          //
          this.loaderService.display(false);
          // this.loaderService.display(false);
        } else {
          this.noResult = true;
          this.loaderService.display(false);
        }
        //
      });
  }

  ngTab(value: any) {
    this.tab = value;
    // this.getExecutiveSearchData();
    this.handleRecordsChange();
  }

  handleChange(value, model) {
    //
    this.storeFilterData();
    if (model === 'leadWithEmail') {
      this.executiveSearchParameter.leadWithEmail = value;
      this.bulkSaveParams = {
        ...this.executiveSearchParameter,
        ...this.filterParams,
      };
      this.amplizService
        .searchExecutive(this.executiveSearchParameter, this.filterParams)
        .subscribe(
          (res) => {
            this.searchResult = res;
            this.totalSearchResult = res.healthExecutiveInfoList;
            this.totalCount = res.totalResult;
            if (this.totalSearchResult.length > 0) {
              this.noResult = false;
              // this.netNewCount = res.netNew;
            } else {
              this.noResult = true;
            }
            this.resetSelectedExecutive();
            this.getNetNewCount();
            //
          },
          (err) => {
            this.noResult = true;
          }
        );
      this.setPage(1);
    } else if (model === 'leadWithPhone') {
      this.executiveSearchParameter.leadWithPhone = value;
      this.bulkSaveParams = {
        ...this.executiveSearchParameter,
        ...this.filterParams,
      };
      this.amplizService
        .searchExecutive(this.executiveSearchParameter, this.filterParams)
        .subscribe(
          (res) => {
            this.searchResult = res;
            this.totalSearchResult = res.healthExecutiveInfoList;
            this.totalCount = res.totalResult;
            if (this.totalSearchResult.length > 0) {
              this.noResult = false;
              // this.netNewCount = res.netNew;
              //
            } else {
              this.noResult = true;
            }
            this.resetSelectedExecutive();
            this.getNetNewCount();
          },
          (err) => {
            this.noResult = true;
          }
        );
      this.setPage(1);
    }
  }

  setPage(page: any, isPrevious: boolean = false) {
    this.selectedExecutiveInCurrentPage = [];
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // this.subscribed = true;
    if (this.subscribed === true || page === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.page = page;
      this.offset = this.limit * (page - 1);
      this.loaderService.display(true);
      this.executiveSearchParameter.offset = this.previousOffsets[page - 1];
      this.executiveSearchParameter.savedListOffset =
        this.previousSavedOffsets[page - 1];
      this.executiveSearchParameter.limit = this.limit;
      this.executiveSearchParameter.leadWithEmail = this.leadWithEmail;
      this.executiveSearchParameter.leadWithPhone = this.leadWithPhone;
      // this.executiveSearchParameter.clientIp = this.clientIp;
      this.executiveSearchParameter.searchType =
        this.tab === 1 ? 'TOTAL' : 'NETNEW';
      this.bulkSaveParams = {
        ...this.executiveSearchParameter,
        ...this.filterParams,
      };
      this.amplizService
        .searchExecutive(this.executiveSearchParameter, this.filterParams)
        .subscribe(
          (res) => {
            //
            this.loaderService.display(false);
            this.unLockDiv = false;
            this.totalSearchResult = res.healthExecutiveInfoList;
            //
            this.totalCount = res.totalResult;
            this.getNetNewCount();
            if (this.totalSearchResult.length > 0) {
              this.noResult = false;
              if (isPrevious == true) {
                this.previousOffsets.pop();
                this.previousSavedOffsets.pop();
              } else {
                this.previousOffsets.push(res.offset);
                this.previousSavedOffsets.push(res.savedListOffset);
              }

              this.getSelectedExecutivesInCurrentPage();
              // this.netNewCount = res.netNew;

              if (this.tab === 1) {
                this.totalSize = res.totalResult;
              }
              if (this.tab === 2) {
                this.totalSize = res.netNew;
              }
              this.totalSize = this.tab === 2 ? res.netNew : res.totalResult;
              //
              this.pager = this.pagerservice.getPager(
                this.totalSize,
                page,
                this.limit
              );
              this.pagedItems = this.totalSearchResult.slice(
                this.pager.startIndex,
                this.pager.endIndex + 1
              );
            } else {
              this.noResult = true;
              this.loaderService.display(false);
            }
          },
          (error) => {}
        );
    } else {
      this.loaderService.display(false);
      this.unLockDiv = true;
      this.pager.currentPage = 2;
      this.offset = this.limit * (this.pager.currentPage - 1);
    }
  }

  get showSaveAllCheckbox() {
    return (
      (this.selectedExecutiveInCurrentPage.length == 0 ||
        this.selectedExecutiveInCurrentPage.length ==
          this.totalSearchResult.length) &&
      this.savedExecutives.length < this.limit
    );
  }
  get showSaveAllPArtial() {
    return (
      this.selectedExecutiveInCurrentPage.length > 0 &&
      this.selectedExecutiveInCurrentPage.length < this.totalSearchResult.length
    );
  }

  getSelectedExecutivesInCurrentPage() {
    this.selectedExecutiveInCurrentPage = this.totalSearchResult
      .filter((contactItem: any) => {
        return this.selectedExecutive.includes(contactItem.executiveId);
      })
      .map((item: any) => item.executiveId);
    this.savedExecutives = this.totalSearchResult.filter(
      (executiveItem: any) => {
        return executiveItem.leadSaveStatus == 'Saved';
      }
    );
  }

  resetSelectedExecutive() {
    this.savedExecutives = [];
    this.selectedExecutive = [];
    this.selectedExecutiveInCurrentPage = [];
  }

  dataRefreshed(ev: any) {
    //
    if (ev === true) {
      this.getExecutiveSearchData();
      // this.getNetNewCount();
    }
  }

  handleIndividualCheckboxChange(value, item) {
    this.handleCheckboxChangeForAll(item);
    this.handleCurrentCheckboxChange(item);
    // const index = this.selectedExecutive.indexOf(item.executiveId);
    // if(index==-1) {
    // this.selectedExecutive.push(item.executiveId);
    // } else {
    //   this.selectedExecutive.splice(index, 1);
    // }
  }
  checkSelectAll(val) {
    this.selectedExecutive = this.selectedExecutive.filter(
      (item) => !this.selectedExecutiveInCurrentPage.includes(item)
    );
    this.selectedExecutiveInCurrentPage = [];
    if (val == true) {
      this.totalSearchResult
        .filter((item: any) => item.leadSaveStatus != 'Saved')
        .map((contact: any) => {
          this.handleCheckboxChangeForAll(contact);
          this.handleCurrentCheckboxChange(contact);
        });
    }
    //   this.selectedExecutive = [];
    //   if(val == true) {
    //     this.selectedExecutive = this.totalSearchResult
    //     .filter(item => item.inSavedList==false)
    //     .map(item =>  item.executiveId);
    //   }
    //   // console.log(this.selectedExecutive,"this.selectedPhysician")
    // }
  }

  handleCurrentCheckboxChange(contact) {
    const currentContactsIndex = this.selectedExecutiveInCurrentPage.indexOf(
      contact.executiveId
    );
    if (currentContactsIndex == -1) {
      if (contact.leadSaveStatus !== 'Saved') {
        this.selectedExecutiveInCurrentPage.push(contact.executiveId);
      }
    } else {
      this.selectedExecutiveInCurrentPage.splice(currentContactsIndex, 1);
    }
  }

  //Handling checkbox change for selection in current page
  handleCheckboxChangeForAll(contact) {
    const contactsIndex = this.selectedExecutive.findIndex(
      (item) => item == contact.executiveId
    );
    if (contactsIndex == -1) {
      if (contact.leadSaveStatus !== 'Saved') {
        this.selectedExecutive.push(contact.executiveId);
      }
    } else {
      this.selectedExecutive.splice(contactsIndex, 1);
    }
  }

  handleRecordsChange() {
    this.offset = 0;
    this.previousOffsets = [0];
    this.previousSavedOffsets = [0];
    this.setPage(1);
  }

  storeFilterData() {
    this.filterStorageService.set(
      'executive_leadWithEmail',
      this.leadWithEmail
    );
    this.filterStorageService.set(
      'executive_leadWithPhone',
      this.leadWithPhone
    );
  }

  getPersistData() {
    this.leadWithPhone =
      this.filterStorageService.get('executive_leadWithPhone') || false;
    this.leadWithEmail =
      this.filterStorageService.get('executive_leadWithEmail') || false;
  }
}
