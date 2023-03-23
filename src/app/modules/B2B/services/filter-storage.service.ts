import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FilterStorageService {
  localStorage: Storage;
  constructor() {
    this.localStorage = window.localStorage;
  }
  get(key: string): any {
    if (this.isLocalStorageSupported) {
      const val = this.localStorage.getItem(key)
      if(val) {
        return JSON.parse(val);
      } else {
        return [];
      }
      
    }
    return null;
  }
  set(key: string, value: any): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  setNumberOrString(key: string, value: any): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.setItem(key, value);
      return true;
    }
    return false;
  }

  getNumber(key: string): any {
    if (this.isLocalStorageSupported) {
      const val = this.localStorage.getItem(key)
      if(val) {
        return parseInt(val);
      }
    }
    return null;
  }
  remove(key: string): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.removeItem(key);
      return true;
    }
    return false;
  }
  get isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }
}
