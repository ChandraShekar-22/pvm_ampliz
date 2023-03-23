import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private physicianSearchData = new BehaviorSubject({});
  public savedPhysicians: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public savedExecutives: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  // observable for searchDatas
  physicianSearch = this.physicianSearchData.asObservable();

  constructor() {}

  changePhysicainSearchData(data: any) {
    this.physicianSearchData.next( data );
  }

  addToSavedPhysician(value: Array<any>) {
    this.savedPhysicians.next(value);
  }
  addToSavedExecutive(value: Array<any>) {
    this.savedExecutives.next(value);
  }
}
