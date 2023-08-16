import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
@Injectable({
	providedIn: 'root'
})
export class PayorService {
	public authToken = localStorage.getItem('auth_token');
	public cook = document.cookie;
	domainName = '';

	constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}
	get organizationId() {
		return localStorage.getItem('organizationId');
	}

	searchMCOExecutives(body: any): Observable<any> {
		const headers = new HttpHeaders({});
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/search-m-c-o-executives';
		console.log(body, 'searchMCOExecutives');
		return this.http.post(
			url,
			{ searchInputMCOExecutives: body, organizationId: this.organizationId },
			{ headers }
		);
	}
	searchMCOExecutivesCount(body: any): Observable<any> {
		const headers = new HttpHeaders({});
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/get-m-c-o-executives-net-new-count';
		return this.http.post(
			url,
			{ searchInputMCOExecutives: body, organizationId: this.organizationId },
			{ headers }
		);
	}
	searchMCOCount(body: any): Observable<any> {
		const headers = new HttpHeaders({});
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/get-m-c-o-net-new-count';
		return this.http.post(url, { searchInputMCO: body, organizationId: this.organizationId }, { headers });
	}
	searchMCO(body: any): Observable<any> {
		const headers = new HttpHeaders({});
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/search-m-c-o';
		return this.http.post(url, { searchInputMCO: body, organizationId: this.organizationId }, { headers });
	}
	createList(body: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/create-list';
		const response = this.http.post(url, { ...body, organizationId: this.organizationId });
		return response;
	}
	savePayourAsPerCount(data: any): Observable<any> {
		const url =
			environment.prodNPIApi + '/amplizhcwriteapi/savedlist/save-m-c-o-executives-records-as-per-count';
		const response = this.http.post(url, { ...data, organizationId: this.organizationId });
		return response;
	}
	getLists(offset: any, count: any, autoCreated: any = false): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/list/get-all-list';
		const body = { offset: offset, count: count, autoCreated: autoCreated };
		const response = this.http.get(url, { params: { ...body, organizationId: this.organizationId } });
		return response;
	}
	viewPayourFromList(body: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/add-m-c-o-executives-to-list';
		const response = this.http.post(url, {
			...body,
			organizationId: this.organizationId
		});
		return response;
	}
	getPayourDetails(mcoExecutiveId: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/get-m-c-o-executive-and-company-detail';
		const response = this.http.get(url, { params: { mcoExecutiveId, organizationId: this.organizationId } });
		return response;
	}
	saveViewedPayour(body: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/save-viewed-lead';
		const response = this.http.post(url, { ...body, organizationId: this.organizationId });
		return response;
	}
	getCompanyList(searchString: string): Observable<any> {
		// console.log(searchString);
		const url =
			environment.prodHcApi +
			'/amplizhcreadapi/general/get-company-list-mco-company-auto-suggest?searchPhrase=' +
			searchString;
		const response = this.http.get(url, { params: { organizationId: this.organizationId } });
		return response;
	}
	getTitlesList(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-mco-title-all-auto-suggest';
		const response = this.http.post(url, { ...params, organizationId: this.organizationId });
		return response;
	}
	reportDataNotCorrectForPayor(body): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-m-c-o-company-data';
		const response = this.http.post(url, { ...body, organizationId: this.organizationId });
		return response;
	}

	reportDataNotCorrectForExecutivePayor(body): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-m-c-o-executive-data';
		const response = this.http.post(url, { ...body, organizationId: this.organizationId });
		return response;
	}
	getPayourCenterDetails(mcoCompanyId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/searchmco/get-m-c-o-detail';
		const response = this.http.get(url, { params: { mcoCompanyId, organizationId: this.organizationId } });
		return response;
	}
	getExecutivesOfPayor(mcoCompanyId: any, offset: any, count: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/searchmco/get-m-c-o-executives';

		const response = this.http.get(url, {
			params: {
				offset: offset,
				count: count,
				mcoCompanyId: mcoCompanyId,
				organizationId: this.organizationId
			}
		});
		return response;
	}
}
