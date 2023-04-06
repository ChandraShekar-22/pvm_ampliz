import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Contact } from '../models/ContactsModel';
import { SearchCompanyInput } from '../models/SearchCompany';
import { SearchContactInput } from '../models/SearchContactModel';

@Injectable()
export class DataService {
  private contactSearchData = new BehaviorSubject({
    data: new SearchContactInput(),
    fromSearch: false,
  });
  private companySearchData = new BehaviorSubject({
    data: new SearchCompanyInput(),
    fromSearch: false,
  });
  private apacList = new BehaviorSubject([]);
  private firstTimeLoad = new BehaviorSubject(true);
  private fromSearchData = new BehaviorSubject(false);
  private mainSelectedTab = new BehaviorSubject(0);
  private landingPageVisible = new BehaviorSubject(false);
  private searchQuotaData = new BehaviorSubject(0);
  private isSearchVisible = new BehaviorSubject({
    saveSearchVisible: false,
    recentSearchVisible: true,
  });
  private isRecentSearchVisible = new BehaviorSubject(false);

  // var for refreshing header
  private refreshHeaderProgess = new Subject<void>();

  private subscriptionStatusData = new BehaviorSubject(0);

  //saved contacts
  public savedContacts: BehaviorSubject<Array<Contact>> = new BehaviorSubject([]);

  // observable for visibility datas for search
  searchVisibility = this.isSearchVisible.asObservable();
  recentSearchVisibility = this.isRecentSearchVisible.asObservable();
  landingPageVisibility = this.landingPageVisible.asObservable();

  // observable for searchDatas
  contactSearch = this.contactSearchData.asObservable();
  companySearch = this.companySearchData.asObservable();
  fromSearch = this.fromSearchData.asObservable();
  searchQuota = this.searchQuotaData.asObservable();
  //observable for tab
  mainTab = this.mainSelectedTab.asObservable();
  apacListSubscriber = this.apacList.asObservable();

  firstLoad = this.firstTimeLoad.asObservable();

  // Observable for Header
  refreshHeaderTrigger = this.refreshHeaderProgess.asObservable();
  // Observable for Subscription status
  subscriptionStatus = this.subscriptionStatusData.asObservable();

  constructor() {}

  // Make Save search visibility
  makeSavesearchVisible(visibility: boolean) {
    this.isSearchVisible.next({
      saveSearchVisible: visibility,
      recentSearchVisible: false,
    });
  }
  // Make Recent search visibility
  makeRecentsearchVisible(visibility: boolean) {
    this.isSearchVisible.next({
      saveSearchVisible: false,
      recentSearchVisible: visibility,
    });
  }
  passSearchQuota(quota: number) {
    this.searchQuotaData.next(quota);
  }
  makeLandingPageVisible(visibility: boolean) {
    this.landingPageVisible.next(visibility);
  }

  passSearchContactInput(contact: SearchContactInput, fromSearch: boolean = true) {
    this.contactSearchData.next({ data: contact, fromSearch: fromSearch });
  }
  passSearchCompanyInput(company: SearchCompanyInput, fromSearch: boolean = true) {
    this.companySearchData.next({ data: company, fromSearch: fromSearch });
  }

  changeSelectedTab(tab: number) {
    this.mainSelectedTab.next(tab);
  }
  searchOrRecentTapped(isTapped: boolean) {
    this.fromSearchData.next(isTapped);
  }
  changeApacList(apac: any) {
    this.apacList.next(apac);
  }
  changeLoadStatus(data: any) {
    this.firstTimeLoad.next(data);
  }

  addToSavedContacts(value: Array<Contact>) {
    this.savedContacts.next(value);
  }

  // For refreshing progress bar in b2b header
  refreshHeader(value?: any) {
    this.refreshHeaderProgess.next();
  }

  // For getting Subscription Status
  passSubscriptionStatus(status: any) {
    this.subscriptionStatusData.next(status);
  }

  get seniorityList() {
    return ['Owner', 'Founder', 'suite', 'Partner', 'Vp', 'Head', 'Director', 'Manager', 'Senior', 'Entry', 'Intern'];
  }

  // Seniority functions for senioirty with IDs
  // get seniorityList() {
  //   return [
  //     { Name: "C-Level", Value: 1 },
  //     { Name: "VP-Level", Value: 2 },
  //     { Name: "Director", Value: 3 },
  //     { Name: "Manager", Value: 4 },
  //     { Name: "Entry", Value: 7 },
  //     { Name: "Non-Manager", Value: 5 },
  //     { Name: "Others", Value: 6 },
  //   ];
  // }
  // handleSeniorityByName(id: any) {
  //   var result = [];
  //   id.map((x) => {
  //     var filter = this.seniorityList.filter((obj) => {
  //       return obj.Value === x;
  //     });
  //     result.push(filter[0].Name);
  //   });
  //   return result;
  // }
  // handleSeniorityById(name: any) {
  //   var result = [];
  //   name.map((x) => {
  //     var filter = this.seniorityList.filter((obj) => {
  //       return obj.Name === x;
  //     });
  //     result.push(filter[0].Value);
  //   });
  //   return result;
  // }
}
