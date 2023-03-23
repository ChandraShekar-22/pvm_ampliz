import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs-compat';
import { environment } from "../../../../environments/environment";
import { SearchLTCModel } from '../models/SearchLTCModel';
import * as fileSaver from "file-saver";
@Injectable({
  providedIn: "root",
})
export class LTCService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  getCompanyList(searchString: string): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-company-list-ltc-auto-suggest?searchPhrase=" +
      searchString;
    const response = this.http.get(url);
    return response;
  }

  getTechnologyListForSelect(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-technology-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }

  getTitlesList(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-title-all-auto-suggest";
    const response = this.http.post(url, params);
    return response;
  }

  getIndustryList(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-industry-list-ltc-auto-suggest";
    const response = this.http.get(url, {params});
    return response;
  }

  getLTCTypeAutoSuggest(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-ltc-type-auto-suggest";
    const response = this.http.get(url, {params});
    return response;
  }


  getSeniorityList(searchString: string): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-seniority-list-for-select?searchPhase=" +
      searchString;
    const response = this.http.get(url);
    return response;
  }

  getSkillList(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-skill-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }
  getTechnologyList(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-technology-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }

  getEmployeeList(): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-employee-list-for-select";
    const response = this.http.get(url);
    return response;
  }

  getRevenueList(): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-revenue-list-for-select";
    const response = this.http.get(url);
    return response;
  }

  getCountryList(value = ""): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-country-list?searchPhase=" +
      value;
    const response = this.http.get(url);
    return response;
  }

  getStateList(searchPhase: any, countryIdList: any): Observable<any> {
    const body = {
      searchPhase: searchPhase,
      countryIdList: countryIdList,
    };
    const url =
      environment.prodHcApi + "/amplizb2bapacreadapi/general/get-state-list";
    const response = this.http.post(url, body);
    return response;
  }

  getCityList(stateId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/general/get-city-list-for-state?stateId=" +
      stateId;
    const response = this.http.get(url);
    return response;
  }
  searchCitiesForStates(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/search-city-for-state-list";
    const response = this.http.post(url, params);
    return response;
  }

  searchLTC(body: SearchLTCModel): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcreadapi/searchltc/search-l-t-c";
    const response = this.http.post(url, { serachInputLTC: body.toJson() });
    return response;
  }

  getLTCCenterDetails(ltcExecutiveId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchltc/get-l-t-c-executive-and-company-detail";
    const response = this.http.get(url, { params: { ltcExecutiveId } });
    return response;
  }

  searchLTCNetNew(body: SearchLTCModel): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchltc/get-l-t-c-net-new-count";
    const response = this.http.post(url, { serachInputLTC: body.toJson() });
    return response;
  }

  saveSearchLTC(body: any) {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacwriteapi/savedsearch/save-search-ltc";
    const response = this.http.post(url, body);
    return response;
  }

  saveDraftLeads() {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/save-draft-leads";
    const response = this.http.post(url, {});
    return response;
  }

  saveSearchCompany(body: any) {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacwriteapi/savedsearch/save-search-company";
    const response = this.http.post(url, body);
    return response;
  }

  getB2BSearchData(body: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/search/search-summary-b-2b-apac";
    const response = this.http.post(url, body);
    return response;
  }

  createList(body: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/create-list";
    const response = this.http.post(url, body);
    return response;
  }
  getLists(offset: any, count: any, autoCreated: any = false): Observable<any> {
    const url = environment.prodHcApi + "/amplizhcreadapi/list/get-all-list";
    const body = { offset: offset, count: count, autoCreated: autoCreated };
    const response = this.http.get(url, { params: body });
    return response;
  }

  searchB2bApacList(listName: any, offset: any, count: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizb2bapacreadapi/savedlist/search-list";
    const body = { offset: offset, count: count, listName: listName };
    const response = this.http.get(url, { params: body });
    return response;
  }

  deleteList(listId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacwriteapi/savedlist/delete-b-2b-apac-list";
    const body = { listId: listId };
    const headers = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      }),
    };
    const response = this.http.post(url, body, headers);
    return response;
  }

  getSavedSearch(offset: any, count: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacreadapi/savedsearch/get-saved-serch";
    const body = { offset: offset, count: count };
    const response = this.http.get(url, { params: body });
    return response;
  }
  getRecentSavedSearch(offset: any, count: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreportapi/report/get-recent-searches-by-user";
    const body = { offset: offset, count: count };
    const response = this.http.get(url, { params: body });
    return response;
  }

  getB2bApacDetails(parameter): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizb2bapacreadapi/savedlist/get-list-detail";
    const body = parameter;
    const response = this.http.get(url, { params: body });
    return response;
  }

  addLTCToList(body: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/add-leads-to-list";
    const response = this.http.post(url, body);
    return response;
  }

  viewLTCFromList(body: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/add-l-t-c-to-list";
    const response = this.http.post(url, body);
    return response;
  }

  saveLTCAsPerCount(data: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/savedlist/save-ltc-records-as-per-count";
    const response = this.http.post(url, data);
    return response;
  }

  saveViewedLTC(body: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/save-viewed-lead";
    const response = this.http.post(url, body);
    return response;
  }

  getDepartmentList(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-department-list";
    const response = this.http.get(url, {params});
    return response;
  }

  reportDataNotCorrect(body): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/customervoice/report-incorrect-l-t-c-data";
    const response = this.http.post(url, body);
    return response;
  }
  getLtcCenterOverview(ltcExecutiveId: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcreadapi/searchltc/get-l-t-c-overview";
    const response = this.http.get(url, {
      params: { ltcExecutiveId },
    });
    return response;
  }
  getLtcCenterMoreInfo(ltcExecutiveId: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcreadapi/searchltc/get-l-t-c-more-info";
    const response = this.http.get(url, {
      params: { ltcExecutiveId },
    });
    return response;
  }
}
