import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs-compat';
import { environment } from "../../../../environments/environment";
import { SearchImagingModel } from '../models/SearchImagingModel';
import * as fileSaver from "file-saver";
import { SearchImagingExecutivesModel } from '../models/SearchImagingExecutivesModel';
@Injectable({
  providedIn: "root",
})
export class ImagingService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  getCompanyList(searchString: string): Observable<any> {
    // console.log(searchString);
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-company-list-imaging-center-auto-suggest?searchPhrase=" +
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

  getIndustryList(body: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/general/get-industry-list-imaging-center-auto-suggest";
    const response = this.http.get(url, { params: body });
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

  searchImagingExecutives(body: SearchImagingExecutivesModel): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/search-imaging-centers-executives";
    const response = this.http.post(url, {
      searchInputImagingCenterExecutives: body.toJson(),
    });
    return response;
  }

  searchImagings(body: SearchImagingModel): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/search-imaging-center";
    const response = this.http.post(url, {
      searchInputImagingCenter: body.toJson(),
    });
    return response;
  }

  getImagingCenterDetails(icExecutiveId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-executive-and-company-detail";
    const response = this.http.get(url, { params: { icExecutiveId } });
    return response;
  }

  searchImagingExecutivesNetNew(
    body: SearchImagingExecutivesModel
  ): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-executives-net-new-count";
    const response = this.http.post(url, {
      searchInputImagingCenterExecutives: body.toJson(),
    });
    return response;
  }

  searchImagingNetNew(body: SearchImagingModel): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-executives-net-new-count";
    const response = this.http.post(url, {
      searchInputImagingCenter: body.toJson(),
    });
    return response;
  }

  saveSearchImaging(body: any) {
    const url =
      environment.prodHcApi +
      "/amplizb2bapacwriteapi/savedsearch/save-search-imaging";
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

  addImagingToList(body: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/add-leads-to-list";
    const response = this.http.post(url, body);
    return response;
  }

  viewImagingFromList(body: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/savedlist/add-imaging-center-executives-to-list";
    const response = this.http.post(url, body);
    return response;
  }

  viewImagingCenterFromList(body: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/savedlist/add-imaging-center-to-list";
    const response = this.http.post(url, body);
    return response;
  }

  saveImagingCenterAsPerCount(data: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/savedlist/save-imaging-center-records-as-per-count";
    const response = this.http.post(url, data);
    return response;
  }

  saveViewedImaging(body: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcwriteapi/savedlist/save-viewed-lead";
    const response = this.http.post(url, body);
    return response;
  }

  getDepartmentList(params: any): Observable<any> {
    const url =
      environment.prodHcApi + "/amplizhcreadapi/general/get-department-list";
    const response = this.http.get(url, { params });
    return response;
  }

  reportDataNotCorrectForImaging(body): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/customervoice/report-incorrect-imaging-center-data";
    const response = this.http.post(url, body);
    return response;
  }

  reportDataNotCorrectForExecutive(body): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcwriteapi/customervoice/report-incorrect-imaging-center-executive-data";
    const response = this.http.post(url, body);
    return response;
  }


  getImagingCenterOverview(icExecutiveId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-overview";
    const response = this.http.get(url, {
      params: { icExecutiveId },
    });
    return response;
  }
  getImagingCenterMoreInfo(icExecutiveId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-more-info";
    const response = this.http.get(url, {
      params: { icExecutiveId },
    });
    return response;
  }
  imagingGetImagingCenterDetails(ImagingCenterId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-detail";
    const response = this.http.get(url, { params: { ImagingCenterId } });
    return response;
  }

  getOverviewOfImagingCenter(ImagingCenterId: any): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-overview-of-imaging-center";
    const response = this.http.get(url, {
      params: { ImagingCenterId },
    });
    return response;
  }
  getExecutivesOfImagingCenter(
    ImagingCenterId: any,
    offset: any,
    count: any
  ): Observable<any> {
    const url =
      environment.prodHcApi +
      "/amplizhcreadapi/searchimagingcenters/get-imaging-center-executives";
     
    const response = this.http.get(url, {
      params: {
        offset: offset,
        count: count,
        ImagingCenterId: ImagingCenterId,
      },
    });
    return response;
  }
  
}
