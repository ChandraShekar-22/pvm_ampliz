import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";
import { LTC } from "../models/LTCModel";
import { SearchLTCModel } from "../models/SearchLTCModel";

@Injectable()
export class DataService {
  private imagingSearchData = new BehaviorSubject({data: new SearchLTCModel(), fromSearch: false});
  private apacList = new BehaviorSubject([]);
  private firstTimeLoad = new BehaviorSubject(true);
 
  //saved contacts
  public savedLTCs: BehaviorSubject<Array<LTC>> = new BehaviorSubject([]);
  
  // observable for visibility datas for search
  
  apacListSubscriber = this.apacList.asObservable();

  firstLoad = this.firstTimeLoad.asObservable();

  constructor() {}


  passSearchLTCInput(contact: SearchLTCModel, fromSearch:boolean = true) {
    this.imagingSearchData.next({data:contact, fromSearch: fromSearch});
  }

  addToSavedContacts(value: Array<LTC>) {
    this.savedLTCs.next(value);
}
}
