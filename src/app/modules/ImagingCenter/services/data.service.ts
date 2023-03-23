import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";
import { Imaging } from "../models/ImagingModel";
import { SearchImagingModel } from "../models/SearchImagingModel";

@Injectable()
export class DataService {
  private imagingSearchData = new BehaviorSubject({data: new SearchImagingModel(), fromSearch: false});
  private apacList = new BehaviorSubject([]);
  private firstTimeLoad = new BehaviorSubject(true);
 
  //saved contacts
  public savedImagings: BehaviorSubject<Array<Imaging>> = new BehaviorSubject([]);
  
  // observable for visibility datas for search
  
  apacListSubscriber = this.apacList.asObservable();

  firstLoad = this.firstTimeLoad.asObservable();

  constructor() {}


  passSearchImagingInput(contact: SearchImagingModel, fromSearch:boolean = true) {
    this.imagingSearchData.next({data:contact, fromSearch: fromSearch});
  }

  addToSavedContacts(value: Array<Imaging>) {
    this.savedImagings.next(value);
}
}
