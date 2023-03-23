import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";
import { ImagingExecutive } from "../models/ImagingExecutivesModel";
import { Imaging } from "../models/ImagingModel";
import { SearchImagingExecutivesModel } from "../models/SearchImagingExecutivesModel";
import { SearchImagingModel } from "../models/SearchImagingModel";

@Injectable()
export class ImagingDataService {
  public imagingSearchData = new BehaviorSubject({ data: new SearchImagingExecutivesModel(), fromSearch: false });
  private apacList = new BehaviorSubject([]);
  private firstTimeLoad = new BehaviorSubject(true);
  public mainSelectedTab = new BehaviorSubject(0);
  
  //saved contacts
  public savedImagings: BehaviorSubject<Array<ImagingExecutive>> = new BehaviorSubject([]);

  // observable for visibility datas for search

  apacListSubscriber = this.apacList.asObservable();

  firstLoad = this.firstTimeLoad.asObservable();

  constructor() { }


  passSearchImagingInput(contact: SearchImagingExecutivesModel, fromSearch: boolean = true) {
    this.imagingSearchData.next({ data: contact, fromSearch: fromSearch });
  }

  addToSavedContacts(value: Array<ImagingExecutive>) {
    this.savedImagings.next(value);
  }
  changeApacList(apac: any) {
    this.apacList.next(apac);
  }


  changeSelectedTab(tab: number) {
    this.mainSelectedTab.next(tab);
  }
}
