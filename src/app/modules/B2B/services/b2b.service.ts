import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs-compat";
import { environment } from "../../../../environments/environment";
import { SearchCompanyInput } from "../models/SearchCompany";
import { SearchContactInput } from "../models/SearchContactModel";
import * as fileSaver from "file-saver";
import { offset } from "highcharts";

@Injectable({
  providedIn: "root",
})
export class B2bService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  getCompanyList(searchString: string): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-company-suggestion?searchPhrase=" +
      searchString;
    const response = this.http.get(url);
    return response;
  }
  getDomainList(searchString: string): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-domain-suggestion?searchPhrase=" +
      searchString;
    const response = this.http.get(url);
    return response;
  }
  getTechnologyListForSelect(params: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizglobalb2breadapi/general/get-technology-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }
  // getEmployeeList(parameter: any): Observable<any> {
  //   const url =
  //     environment.prodHcApi +
  //     "/amplizglobalb2breadapi/general/get-employee-list-for-select";
  //  const body = parameter;
  //   const response = this.http.get(url, { params: body });
  //   return response;
  // }

  getTitlesList(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-title-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }

  getIndustryList(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-industry-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }

  getSeniorityList(searchString: string): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-seniority-list-for-select?searchPhrase=" +
      searchString;
    const response = this.http.get(url);
    return response;
  }

  getSkillList(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-skill-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }
  getTechnologyList(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-technology-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }

  getEmployeeList(): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-employee-list-for-select";
    const response = this.http.get(url);
    return response;
  }

  getRevenueList(): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-revenue-list-for-select";
    const response = this.http.get(url);
    return response;
  }

  getCountryList(value = ""): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-country-list?searchPhrase=" +
      value;
    const response = this.http.get(url);
    return response;
  }

  getStateList(searchPhrase: any, countryIdList: any): Observable<any> {
    const body = {
      searchPhrase: searchPhrase,
      countryIdList: countryIdList,
    };
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-state-list";
    const response = this.http.post(url, body);
    return response;
  }

  getCityList(stateId: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-city-list-for-state?stateId=" +
      stateId;
    const response = this.http.get(url);
    return response;
  }
  searchCitiesForStates(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/search-city-for-state-list";
    const response = this.http.post(url, params);
    return response;
  }
  searchContact(body: SearchContactInput): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/search/search-contact";
    const response = this.http.post(url, { searchInput: body.toJson() });
    return response;
  }
  searchContactNetNew(body: SearchContactInput): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/search/search-contact-net-new-count";
    const response = this.http.post(url, { searchInput: body.toJson() });
    return response;
  }
  searchContactViewedNetNew(): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/get-viewd-count";
    const response = this.http.get(url);
    return response;
  }
  searchCompany(body: SearchCompanyInput): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/search/search-company";
    const response = this.http.post(url, { searchInput: body.toJson() });
    return response;
  }
  // Net new count for company
  searchCompanyNetNew(body: SearchCompanyInput): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/search/search-company-net-new-count";
    const response = this.http.post(url, { searchInput: body.toJson() });
    return response;
  }

  saveSearchContact(body: any) {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedsearch/save-search-contact";
    const response = this.http.post(url, body);
    return response;
  }

  saveDraftLeads() {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/save-draft-leads";
    const response = this.http.post(url, {});
    return response;
  }

  saveSearchCompany(body: any) {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedsearch/save-search-company";
    const response = this.http.post(url, body);
    return response;
  }

  getB2BSearchData(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/search/search-summary-b2b-global";
    const response = this.http.post(url, body);
    return response;
  }

  createB2bApacList(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/create-b-2b-global-list";
    const response = this.http.post(url, body);
    return response;
  }

  createB2bList(body: any): Observable<any> {
    // const url = environment.prodAdbApi + "/ADB/api/create-list";
    // const url = environment.prodGlobalB2BApi + "/amplizglobalb2bwriteapi/savedlist/create-list";
    const url = environment.prodGlobalB2BApi + "/amplizglobalb2bwriteapi/savedlist/create-b-2b-global-list";
    const response = this.http.post(url, body);
    return response;
  }

  updateList(body: any): Observable<any> {
    const url = environment.prodAdbApi + "/ADB/api/create-list";
    const response = this.http.post(url, body);
    return response;
  }

  getB2bApacList(
    offset: any,
    count: any,
    autoCreated: any = false,
    filter?: any
  ): Observable<any> {
    // const url = environment.prodAdbApi + "/ADB/api/get-all-list";
    const url = environment.prodGlobalB2BApi + "/amplizglobalb2breadapi/savedlist/get-all-list";
    let body;
    if (filter) {
      body = {
        offset: offset,
        count: count,
        autoCreated: autoCreated,
        listType: "B2B",
        listStatus: filter,
      };
    } else {
      body = {
        offset: offset,
        count: count,
        autoCreated: autoCreated,
        listType: "B2B",
      };
    }

    const response = this.http.get(url, { params: body });
    return response;
  }

  searchB2bApacList(listName: any, offset: any, count: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/search-list";
    const body = { offset: offset, count: count, listName: listName };
    const response = this.http.get(url, { params: body });
    return response;
  }

  deleteList(listId: any): Observable<any> {
    // const url = environment.prodAdbApi + "/ADB/api/delete-list";
    const url = environment.prodGlobalB2BApi + "/amplizglobalb2bwriteapi/savedlist/delete-b-2b-global-list";
    const body = { listId: listId, listType: "B2B" };
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
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedsearch/get-saved-serch";
    const body = { offset: offset, count: count };
    const response = this.http.get(url, { params: body });
    return response;
  }
  getRecentSavedSearch(offset: any, count: any): Observable<any> {
    // Global API is missing
    const url =
      environment.prodGlobalB2BApi +
      "/amplizb2breportapi/report/get-recent-searches-by-user";
    const body = { offset: offset, count: count };
    const response = this.http.get(url, { params: body });
    return response;
  }

  getB2bApacDetails(parameter): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/get-list-detail";
    const body = parameter;
    const response = this.http.get(url, { params: body });
    return response;
  }

  addContactToB2bApac(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/add-contact-to-b-2b-global-list";
    // environment.prodGlobalB2BApi +
    // "/amplizglobalb2bwriteapi/savedlist/add-contact-to-b-2b-apac-list";
    const response = this.http.post(url, body);
    return response;
  }

  viewContactFromList(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/add-contact-to-list";
    const response = this.http.post(url, body);
    return response;
  }
  saveViewedContact(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      // "/amplizglobalb2bwriteapi/savedlist/add-contact-to-list";
      "/amplizglobalb2bwriteapi/savedlist/save-viewed-lead";
    const response = this.http.post(url, body);
    return response;
  }
  viewContact(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/view-contact";
    const response = this.http.post(url, body);
    return response;
  }

  renameSavedSearchContact(body: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedsearch/update-save-search-name";
    const response = this.http.post(url, body);
    return response;
  }

  getDepartmentList(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-department-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }

  getSearchQuota(): Observable<any> {
    // console.log(searchString);
    const url = environment.prodGlobalB2BApi + "/amplizglobalb2breadapi/user/get-search-quota";
    const response = this.http.get(url);
    return response;
  }

  reportDataNotCorrect(body): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/report-data-not-correct";
    const response = this.http.post(url, body);
    return response;
  }

  isUserInvited(emailId): Observable<any> {
    const params = {
      email: emailId,
    };
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/user/is-user-invited";
    const response = this.http.get(url, { params });
    return response;
  }

  inviteTeamMember(teamMemberEmailId): Observable<any> {
    const body = {
      teamMemberEmailId,
    };
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/user/invite-team-member";
    const response = this.http.post(url, body);
    return response;
  }
  reInviteTeamMember(teamMemberEmailId): Observable<any> {
    const body = {
      teamMemberEmailId,
    };
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/user/re-invite-team-member";
    const response = this.http.post(url, body);
    return response;
  }

  getInvitedEmailList(): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/user/get-invited-email-list-for-user";
    const response = this.http.get(url);
    return response;
  }

  savePeopleAsPerCount(body): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedlist/save-people-records-as-per-count";
    const response = this.http.post(url, body);
    return response;
  }

  sendVerificationCode(body): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/user/send-verification-code";
    const response = this.http.post(url, body);
    return response;
  }

  addPhoneNumber(body): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/user/add-phone-number";
    const response = this.http.post(url, body);
    return response;
  }

  verifyPhoneNumber(body): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/user/verify-phone-number";
    const response = this.http.post(url, body);
    return response;
  }

  exportToCsv(body: any) {
    const headers = new HttpHeaders({
      responseType: "blob",
      Accept: "application/json; charset=utf-8",
    });
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/export-selected-contacts-to-csv";
    const response = this.http.post(url, body, {
      headers: headers,
      observe: "response",
      responseType: "blob",
    });
    return response;
  }

  exportBulkToCsv(body: any) {
    const headers = new HttpHeaders({
      responseType: "blob",
      Accept: "application/json; charset=utf-8",
    });
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/export-bulk-contacts-to-csv";
    return this.http.post(url, body, {
      headers: headers,
      observe: "response",
      responseType: "blob",
    });
  }

  requestData(body) {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2bwriteapi/savedsearch/request-data";
    const response = this.http.post(url, body);
    return response;
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: "text/csv; charset=utf-8" });
    fileSaver.saveAs(blob, filename);
  }

  getActivityStatus() {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/user/get-activity-status-of-user";
    const response = this.http.get(url);
    return response;
  }

  exportSelectedCsv(body) {
    const headers = new HttpHeaders({
      responseType: "blob",
      Accept: "application/json; charset=utf-8",
    });
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/export-selected-list";
    const response = this.http.post(url, body, {
      headers: headers,
      observe: "response",
      responseType: "blob",
    });
    return response;
  }
  exportAllCsv(body: any) {
    const headers = new HttpHeaders({
      responseType: "blob",
      Accept: "application/json; charset=utf-8",
    });
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/export-list";
    const response = this.http.get(url, {
      params: body,
      headers: headers,
      observe: "response",
      responseType: "blob",
    });
    return response;
  }

  // GET Company Keywords List
  getCompanyKeywordList(params: any): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/general/get-speciality-id-list-for-select";
    const response = this.http.post(url, params);
    return response;
  }
  getViewedContacts(body: SearchContactInput): Observable<any> {
    const url =
      environment.prodGlobalB2BApi +
      "/amplizglobalb2breadapi/savedlist/get-viewd-list";
    const params = {
      offset: body.offset,
      count: body.count,
    };
    const response = this.http.get(url, {
      params: { offset: body.offset, count: body.count },
    });
    return response;
  }
  decreaseQuotaByOne(): Observable<any> {
    const url =
      environment.prodAdbApi + "/ADB/api/decrement-search-quota-by-one";
    const response = this.http.post(url, {});
    return response;
  }
  b2bCheckSubscriptionStatus(): Observable<any> {
      const headers = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      }),
    };
    const url = environment.prodGlobalB2BApi + "/amplizglobalb2breadapi/user/check-subscription-status";
    const response = this.http.get(url, headers) as Observable<any>;
    return response;
  }
}
