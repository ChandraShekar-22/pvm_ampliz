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

	searchMCOExecutives(body: any): Observable<any> {
		const headers = new HttpHeaders({});
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/search-m-c-o-executives';
		console.log(body, 'searchMCOExecutives');
		return this.http.post(url, { searchInputMCOExecutives: body }, { headers });
	}
	searchMCOExecutivesCount(body: any): Observable<any> {
		const headers = new HttpHeaders({});
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/get-m-c-o-executives-net-new-count';
		return this.http.post(url, { searchInputMCOExecutives: body }, { headers });
	}
	searchMCOCount(body: any): Observable<any> {
		const headers = new HttpHeaders({  });
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/get-m-c-o-net-new-count';
		return this.http.post(url, { searchInputMCO: body }, { headers });
	}
	searchMCO(body: any): Observable<any> {
		const headers = new HttpHeaders({  });
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/search-m-c-o';
		return this.http.post(url, { searchInputMCO: body }, { headers });
	}
	createList(body: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/create-list';
		const response = this.http.post(url, body);
		return response;
	}
	savePayourAsPerCount(data: any): Observable<any> {
		const url =
			environment.prodNPIApi + '/amplizhcwriteapi/savedlist/save-m-c-o-executives-records-as-per-count';
		const response = this.http.post(url, data);
		return response;
	}
	getLists(offset: any, count: any, autoCreated: any = false): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/list/get-all-list';
		const body = { offset: offset, count: count, autoCreated: autoCreated };
		const response = this.http.get(url, { params: body });
		return response;
	}
	viewPayourFromList(body: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/add-m-c-o-executives-to-list';
		const response = this.http.post(url, {
			...body,
			organizationId: '6490060c2c504b70a48b48e3'
		});
		return response;
	}
	getPayourDetails(mcoExecutiveId: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/searchmco/get-m-c-o-executive-and-company-detail';
		const response = this.http.get(url, { params: { mcoExecutiveId } });
		return response;
	}
	saveViewedPayour(body: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/save-viewed-lead';
		const response = this.http.post(url, body);
		return response;
	}
	getCompanyList(searchString: string): Observable<any> {
		// console.log(searchString);
		const url =
			environment.prodHcApi +
			'/amplizhcreadapi/general/get-company-list-mco-company-auto-suggest?searchPhrase=' +
			searchString;
		const response = this.http.get(url);
		return response;
	}
	getTitlesList(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-mco-title-all-auto-suggest';
		const response = this.http.post(url, params);
		return response;
	}
	reportDataNotCorrectForPayor(body): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-m-c-o-company-data';
		const response = this.http.post(url, body);
		return response;
	}

	reportDataNotCorrectForExecutivePayor(body): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-m-c-o-executive-data';
		const response = this.http.post(url, body);
		return response;
	}
	getPayourCenterDetails(mcoCompanyId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/searchmco/get-m-c-o-detail';
		const response = this.http.get(url, { params: { mcoCompanyId } });
		return response;
	}
	getExecutivesOfPayor(mcoCompanyId: any, offset: any, count: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/searchmco/get-m-c-o-executives';

		const response = this.http.get(url, {
			params: {
				offset: offset,
				count: count,
				mcoCompanyId: mcoCompanyId
			}
		});
		return response;
	}
}
