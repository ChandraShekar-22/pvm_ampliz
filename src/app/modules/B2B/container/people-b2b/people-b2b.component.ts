import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SkeletonloaderService } from 'src/app/modules/healthcare/services/skeletonloader.service';
import { Contact, ContactsList } from '../../models/ContactsModel';
import { SearchContactInput } from '../../models/SearchContactModel';
import { B2bService } from '../../services/b2b.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-people-b2b',
  templateUrl: './people-b2b.component.html',
  styleUrls: ['./people-b2b.component.css'],
})
export class PeopleB2bComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isRecentVisible: boolean;
  @Input() isSaveVisible: boolean;
  noResult: boolean = false;
  selectedFilter: SearchContactInput = new SearchContactInput();
  contactsList: ContactsList = new ContactsList();
  //For pagination
  currentItemNumber: number = 0;
  totalItemCount: number = 0;
  totalSavableItemCount: number = 0;
  apacList: Array<any> = [];
  showLandingDashboard: boolean = false;
  showLoader: boolean = false;
  topTabLoader: boolean = false;
  searchQuotaUsed: number = 1;
  loaderSubscription: Subscription;
  previousOffsets: Array<any> = [0];
  pageNumberOptions: Array<any> = [5, 10, 25, 50];
  showActivityCards: boolean = false;
  lowCreditAlert: boolean = false;
  showActivityBack: boolean = false;
  offset: number = 0;
  currentTab: number = 0;
  tabItems = [
    { name: `Total`, icon: { name: '' } },
    { name: `Net New (0)`, icon: { name: '' } },
  ];
  viewedCount: number = 0;
  totalCount: number = 0;
  subscribed: boolean = true;
  landingPageSubscription: Subscription;

  selectedContacts: Array<any> = [];
  selectedContactsInCurrentPage: Array<any> = [];
  isSubscribed: any = false;
  showUpgradeCard: boolean = false;
  //New implementation
  isFilter: boolean = false;

  //Save contacts for remove masking
  savedContacts: Array<Contact> = [];

  allContactsSelected: boolean = false;
  previousSavedOffsets: Array<any> = [0];

  showViewedContact: boolean = false;

  constructor(
    private b2bService: B2bService,
    private dataService: DataService,
    private loaderService: SkeletonloaderService,
    private activateRoute: ActivatedRoute
  ) {}

  get showNoResult() {
    return (
      this.noResult &&
      !this.showActivityCards &&
      this.showLandingDashboard == false &&
      this.isRecentVisible == false &&
      this.isSaveVisible == false &&
      this.isFilter
    );
  }

  get showResult() {
    return (
      this.showLandingDashboard == false &&
      this.isRecentVisible == false &&
      this.isSaveVisible == false &&
      !this.noResult &&
      !this.showActivityCards
    );
  }

  get allVisibleSelected() {
    return this.selectedContactsInCurrentPage.length >= this.selectedFilter.count;
  }
  get partiallySelected() {
    return (
      this.selectedContactsInCurrentPage.length < this.selectedFilter.count &&
      this.selectedContactsInCurrentPage.length > 0
    );
  }
   get decrementEnabled() {
    return this.offset > 0;
  }

  ngOnInit() {
    // this.getContactsList();
    this.getApacList();
    this.getViewedListCount();
    this.checkRecentSearch();
    this.getLandingPageVisibility();
    this.getLoaderValue();

    this.getSearchContactNetNew(this.selectedFilter);
    let url = window.location.href;
    this.companyReceviedFromExt(url);
    // this.collectCreditAndQuotaStatus();
    // Add this line in left right icons ==> [ngClass]="{'disabledPagination': isSubscribed==false}"
    this.getSearchQuota();
    this.dataService.savedContacts.subscribe((res: Array<Contact>) => {
      this.contactsList.updateContactsListFromSavedList(res);
    });
  }

  companyReceviedFromExt(url) {
    if (url.includes('?companyName')) {
      let paramString = url.split('?')[1];
      let queryString = new URLSearchParams(paramString);
      const searchData = new SearchContactInput();
      searchData.companyList.push(queryString.get('companyName'));
      const contactObj = this.selectedFilter.fromJson(searchData);
      this.dataService.passSearchContactInput(contactObj);
    }
  }

  collectCreditAndQuotaStatus() {
    this.dataService.subscriptionStatus.subscribe((status: any) => {
      const remainingCredits = status.dailyCredit - status.usedCredit;
      this.manageLowCreditView(remainingCredits);
    });

    this.getSearchQuota();
    this.isSubscribed = localStorage.getItem('SubscriptionisActive') == 'true';
  }

  manageLowCreditView(credit) {
    if (credit < 10) {
      if (credit <= 0) {
        this.showUpgradeCard = true;
        this.lowCreditAlert = true;
      } else {
        this.lowCreditAlert = true;
      }
    } else {
      this.lowCreditAlert = false;
    }
  }

  manageActivityView(quota) {
    if (quota === 100) {
      this.showLandingDashboard = false;
      this.showActivityCards = true;
    } else {
      this.showActivityCards = false;
    }
  }

  getLoaderValue() {
    setTimeout(() => {
      this.loaderSubscription = this.loaderService.status.subscribe((res) => {
        this.showLoader = res;
      });
    });
  }

  handleRecordsChange() {
    this.selectedFilter.offset = 0;
    this.selectedFilter.savedListOffset = 0;
    this.previousOffsets = [0];
    this.getContactsList();
    this.offset = 0;
  }

  ngOnDestroy() {
    if (this.landingPageSubscription) {
      this.landingPageSubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

  getLandingPageVisibility() {
    this.landingPageSubscription = this.dataService.landingPageVisibility.subscribe((res) => {
      this.showLandingDashboard = res;
      if (this.showLandingDashboard == true) {
        this.dataService.makeRecentsearchVisible(false);
      }
    });
  }

  getSearchQuota() {
    this.b2bService.getSearchQuota().subscribe((res) => {
      this.dataService.passSearchQuota(res);
      let val: any = res;
      this.searchQuotaUsed = val.percentageRemaining;
      this.manageActivityView(val.percentageUsed);
      // this.dataService.passSearchQuota(1); //TEMPRORAY fix for search quota
    });
  }

  ngOnChanges() {
    if (this.isRecentVisible == false && this.isSaveVisible == false && !this.noResult) {
      this.dataService.changeLoadStatus(false);
    }
  }
  handleTabChange(event) {
    this.currentTab = event;
    if (event == 0) {
      this.selectedFilter.searchType = 'TOTAL';
    } else {
      this.selectedFilter.searchType = 'NETNEW';
    }
    this.selectedFilter.offset = 0;
    this.selectedFilter.savedListOffset = 0;
    this.currentItemNumber = 0;
    this.previousOffsets = [0];
    this.offset = 0;
    if (event == 0) {
      this.getContactsList();
      if (!this.isFilter) {
        this.showViewedContact = false;
      }
    } else if (event == 1) {
      this.getViewedData();
      if (!this.isFilter) {
        this.showViewedContact = true;
      }
    }
  }

  checkRecentSearch() {
    this.b2bService.getRecentSavedSearch(0, 2).subscribe((res) => {
      if (res.totalCount == 0) {
        this.dataService.makeLandingPageVisible(true);
      } else if (res.totalCount > 0) {
        this.dataService.makeLandingPageVisible(false);
      }
    });
  }
  filterChanged(event: SearchContactInput) {
    this.selectedFilter = event;
    this.selectedFilter.offset = 0;
    this.selectedFilter.savedListOffset = 0;
    this.currentItemNumber = 0;
    this.previousOffsets = [0];
    this.handleTabChange(0);
    this.showViewedContact = false;
    this.b2bService.saveDraftLeads().subscribe((res) => {
      this.getContactsList();
    });
    const isValid = event.validateContactSearch();
    if (isValid) {
      this.showLandingDashboard = false;
      this.dataService.makeLandingPageVisible(false);
      this.dataService.makeRecentsearchVisible(false);
      this.dataService.makeSavesearchVisible(false);
    }
  }
  getContactsList(isPrevious: boolean = false) {
    if (this.isFilter) {
      const contactsBody: SearchContactInput = this.selectedFilter;
      // console.log(this.previousOffsets,"this.previousOffsets");
      contactsBody.offset = this.offset;
      contactsBody.savedListOffset = this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;

      this.loaderService.display(true);
      this.noResult = false;
      this.topTabLoader = true;
      this.b2bService.searchContact(contactsBody).subscribe(
        (res: any) => {
          this.collectCreditAndQuotaStatus();
          // this.getSearchQuota();
          this.loaderService.display(false);
          this.previousOffsets.push(res.offset);
          this.previousSavedOffsets.push(res.savedListOffset);
          this.contactsList.contacts = res.contactInfoList;
          this.selectedContactsInCurrentPage = this.contactsList.contacts
            .filter((contactItem: any) => {
              return this.selectedContacts.includes(contactItem.contactId);
            })
            .map((item: any) => item.contactId);
          if (this.contactsList.contacts.length !== 0) {
            this.noResult = false;
            this.changeTabItems();
          } else {
            this.noResult = true;
          }

          this.getSearchContactNetNew(contactsBody);
        },
        (err) => {
          this.getSearchQuota();
          this.noResult = true;
          this.collectCreditAndQuotaStatus();
          this.topTabLoader = false;
          this.loaderService.display(false);
        }
      );
    }
  }

  getSearchContactNetNew(contactsBody) {
    this.topTabLoader = true;
    this.b2bService.searchContactNetNew(contactsBody).subscribe(
      (netNewRes) => {
        this.totalCount = netNewRes.totalCount;
        this.totalItemCount = netNewRes.totalCount;
        if (this.totalItemCount > 1000) {
          this.totalSavableItemCount = 1000;
        } else {
          this.totalSavableItemCount = this.totalItemCount;
        }
        this.changeTabItems();
        this.topTabLoader = false;
      },
      (err) => {
        this.topTabLoader = false;
        this.loaderService.display(false);
      }
    );
  }

  changeTabItems() {
    this.tabItems[0].name = `Total (${this.numberWithCommas(this.totalCount)})`;
    this.tabItems[1].name = `Viewed (${this.numberWithCommas(this.viewedCount)})`;
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

 

  decrementPage() {
    if (this.decrementEnabled) {
      // this.showUpgradeCard = false;
      this.previousOffsets.splice(this.previousOffsets.length - 2, 2);
      this.previousSavedOffsets.splice(this.previousOffsets.length - 2, 2);
      // console.log(this.previousOffsets);
      this.selectedContactsInCurrentPage = [];
      this.selectedFilter.offset = this.selectedFilter.offset - this.selectedFilter.count;
      this.offset = this.offset - this.selectedFilter.count;
      this.currentItemNumber = this.selectedFilter.offset;
      this.clearSave();
      if (this.currentTab === 1) {
        this.getViewedData();
      } else {
        this.getContactsList(true);
      }
    }
  }

  get incrementEnabled() {
    return this.offset + this.selectedFilter.count < this.totalItemCount;
  }

  incrementPage() {
    if (this.incrementEnabled) {
      // this.showUpgradeCard = false;
      this.selectedContactsInCurrentPage = [];
      this.selectedFilter.offset = this.selectedFilter.offset + this.selectedFilter.count;
      this.offset = this.offset + this.selectedFilter.count;
      this.currentItemNumber = this.selectedFilter.offset;
      this.clearSave();
      if (this.currentTab === 1) {
        this.getViewedData();
      } else {
        this.getContactsList();
      }
      // } else {
      //   this.offset = this.offset + this.selectedFilter.count;
      //   this.selectedFilter.offset = this.offset;
      //   // this.showUpgradeCard = true;
      // }
    }
  }
  handleSelectAll(event) {
    this.allContactsSelected = event;
    this.selectedContactsInCurrentPage = [];
    this.selectedContacts = [];
    // this.selectedContacts = this.selectedContacts.filter(item => !this.selectedContactsInCurrentPage.includes(item));
    // this.selectedContactsInCurrentPage = [];
    // if(event==true) {
    //   this.contactsList.map((contact: any) => {
    //     this.handleCheckboxChangeForAll(contact);
    //     this.handleCurrentCheckboxChange(contact);
    //   });
    // }
  }
  clearSave() {
    this.allContactsSelected = false;
    this.selectedContactsInCurrentPage = [];
    this.selectedContacts = [];
  }

  handleSelectVisible(event) {
    this.allContactsSelected = false;
    this.selectedContacts = this.selectedContacts.filter((item) => !this.selectedContactsInCurrentPage.includes(item));
    this.selectedContactsInCurrentPage = [];
    if (event == true) {
      this.contactsList.contacts.map((contact: any) => {
        if (
          ((contact.directDialPhone.length > 0 && contact.email.length > 0) || contact.email.length > 0) &&
          contact.inSavedList === false
        ) {
          this.handleCheckboxChangeForAll(contact);
          this.handleCurrentCheckboxChange(contact);
        }
      });
    }
  }
  handleCheckboxChange(event, contact) {
    if (this.allContactsSelected) {
      this.allContactsSelected = false;
      return;
    }
    this.handleCheckboxChangeForAll(contact);
    this.handleCurrentCheckboxChange(contact);
  }

  //Handling checkbox change for all selection
  handleCurrentCheckboxChange(contact) {
    const currentContactsIndex = this.selectedContactsInCurrentPage.indexOf(contact.contactId);
    if (currentContactsIndex == -1) {
      this.selectedContactsInCurrentPage.push(contact.contactId);
    } else {
      this.selectedContactsInCurrentPage.splice(currentContactsIndex, 1);
    }
    // console.log(this.selectedContactsInCurrentPage,"contact.contactId")
  }

  //Handling checkbox change for selection in current page
  handleCheckboxChangeForAll(contact) {
    const contactsIndex = this.selectedContacts.findIndex((item) => item == contact.contactId);
    if (contactsIndex == -1) {
      this.selectedContacts.push(contact.contactId);
    } else {
      this.selectedContacts.splice(contactsIndex, 1);
    }
  }

  getApacList() {
    this.b2bService.getB2bApacList(0, 40).subscribe((res) => {
      this.dataService.changeApacList(res.savedlistInfoList);
    });
  }
  getViewedListCount() {
    // this.b2bService.getB2bApacList(0, 40, true).subscribe((res) => {
    //   let viewed = res.savedlistInfoList.filter(
    //     (l) => l.listName.toLowerCase() == "viewed"
    //   );
    //   this.viewedCount = viewed[0].noOfLeads;
    //   this.changeTabItems();
    // });
    this.b2bService.searchContactViewedNetNew().subscribe((res) => {
      this.viewedCount = res.totalCount;
      this.tabItems[1].name = `Viewed (${this.numberWithCommas(this.viewedCount)})`;
    });
  }
  getViewedData() {
    this.loaderService.display(true);
    this.topTabLoader = true;
    const contactsBody: SearchContactInput = this.selectedFilter;
    // console.log(this.previousOffsets,"this.previousOffsets");
    // contactsBody.offset = this.previousOffsets[this.previousOffsets.length - 1];
    contactsBody.offset = this.offset;
    contactsBody.savedListOffset = this.previousSavedOffsets[this.previousSavedOffsets.length - 1] || 0;

    this.noResult = false;
    this.b2bService.getViewedContacts(contactsBody).subscribe(
      (res: any) => {
        this.loaderService.display(false);
        this.previousOffsets.push(res.offset);
        this.previousSavedOffsets.push(res.savedListOffset);
        this.contactsList.contacts = res.savedlistInfoList;
        this.totalCount = res.totalCount;
        this.totalItemCount = res.totalCount;
        if (this.totalItemCount > 1000) {
          this.totalSavableItemCount = 1000;
        } else {
          this.totalSavableItemCount = this.totalCount;
        }
        this.topTabLoader = false;
        // this.selectedContactsInCurrentPage = this.contactsList.contacts
        //   .filter((contactItem: any) => {
        //     return this.selectedContacts.includes(contactItem.contactId);
        //   })
        //   .map((item: any) => item.contactId);
        // if (this.contactsList.contacts.length !== 0) {
        //   this.noResult = false;
        //   // this.totalCount = res.totalResult;
        //   // this.changeTabItems(res);
        //   // this.totalItemCount =
        //   //   this.currentTab == 0 ? res.totalResult : res.netNew;
        //   // if (this.totalItemCount > 1000) {
        //   //   this.totalSavableItemCount = 1000;
        //   // } else {
        //   //   this.totalSavableItemCount = this.totalItemCount;
        //   // }
        // } else {
        //   this.noResult = true;
        // }
      },
      (err) => {
        this.getSearchQuota();
        this.noResult = true;
        this.loaderService.display(false);
        this.topTabLoader = false;
      }
    );
  }
  handleContactAddList() {
    this.selectedContacts = [];
    this.selectedContactsInCurrentPage = [];
    this.allContactsSelected = false;
    this.getContactsList();
  }
  openActivityComponents() {
    this.showActivityCards = true;
    this.showActivityBack = true;
  }
  peopleCheckboxDisabled(item) {
    return item.leadSaveStatus == 'Saved';
  }
  isFilterApplied(isFilter: any) {
    this.isFilter = isFilter;
    if (!isFilter) {
      if (this.currentTab == 1) {
        this.showViewedContact = true;
      }
      this.noResult = false;
      this.getSearchContactNetNew(this.selectedFilter);
    }
  }
}
