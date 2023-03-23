import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";
import { LTC } from "../models/LTCModel";
import { SearchLTCModel } from "../models/SearchLTCModel";

@Injectable()
export class LTCDataService {
  public ltcSearchData = new BehaviorSubject({ data: new SearchLTCModel(), fromSearch: false });
  private apacList = new BehaviorSubject([]);
  private firstTimeLoad = new BehaviorSubject(true);

  //saved contacts
  public savedLTCs: BehaviorSubject<Array<LTC>> = new BehaviorSubject([]);

  // observable for visibility datas for search

  apacListSubscriber = this.apacList.asObservable();

  firstLoad = this.firstTimeLoad.asObservable();

  constructor() { }


  passSearchLTCInput(contact: SearchLTCModel, fromSearch: boolean = true) {
    this.ltcSearchData.next({ data: contact, fromSearch: fromSearch });
  }

  addToSavedLTC(value: Array<LTC>) {
    this.savedLTCs.next(value);
  }
  changeApacList(apac: any) {
    this.apacList.next(apac);
  }
}
