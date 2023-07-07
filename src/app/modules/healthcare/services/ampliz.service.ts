import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SearchPhysicianModel } from '../models/searchPhysicianModel';
//import {catchError,retry} from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AmplizService {
	//public serverIP = 'http://182.75.51.226:8000/';
	// public serverIP = 'http://10.10.25.97:443/';
	//  public serverIP = 'https://go.ampliz.com/';
	public serverIP = 'http://amplizhc.ioolabs.com:9000/';
	// public ADBserverIP = "https://go.ampliz.com/ADB/";
	// public userId = localStorage.getItem('user_id');
	public authToken = localStorage.getItem('auth_token');
	public cook = document.cookie;
	domainName = '';
	get organizationId() {
		return localStorage.getItem('organizationId');
	}

	constructor(
		private http: HttpClient,
		private router: Router,
		private cookieService: CookieService
	) {}
	hospitals: any = [];
	login(body: any): Observable<any> {
		const headers = new HttpHeaders({ ...body });
		const url = environment.prodAdbApi + '/ADB/api/login';
		// const url = 'https://stage.ampliz.com/ADB/api/login';

		return this.http.post(url, {}, { headers });
	}

	revokeToken() {
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
		});
		const url = environment.prodAdbApi + '/ADB/api/access_revoke';
		return this.http.delete(url, { headers });
	}

	getContactDetails(): Observable<any> {
		// tslint:disable-next-line:max-line-length
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/allfavorites';
		const response = this.http.get(url, headers);

		return response;
	}

	getDashboardDetails(): Observable<any> {
		// tslint:disable-next-line:max-line-length
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		const url = environment.prodAdbApi + '/ADB/user/dashboard';
		const response = this.http.get(url, headers);
		return response;
	}

	signUp(body: any): Observable<any> {
		// tslint:disable-next-line:max-line-length
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
				...body,
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/signup';
		const response = this.http.post(url, {}, headers);
		return response;
	}

	forgot(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));
		// tslint:disable-next-line:max-line-length
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
				...body,
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/forgotpassword';
		const response = this.http.post(url, {}, headers);
		return response;
	}

	refreshRevokeToken() {
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + localStorage.getItem('refresh_token'),
		});
		const url = environment.prodAdbApi + '/ADB/api/refresh_revoke';
		return this.http.delete(url, { headers });
	}
	refreshToken() {
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + localStorage.getItem('refresh_token'),
		});
		const url = environment.prodAdbApi + '/ADB/api/refresh';
		return this.http.delete(url, { headers });
	}

	validatePromocode(body: any): Observable<any> {
		// tslint:disable-next-line:max-line-length
		//
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
				cc: body,
				...body,
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/rc';
		const response = this.http.post(url, {}, headers);

		return response;
	}

	changePassowrd(body: any): Observable<any> {
		// tslint:disable-next-line:max-line-length
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
				password: body,
				...body,
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/changepassword';
		const response = this.http.post(url, {}, headers);

		return response;
	}

	editprofile(body: any): Observable<any> {
		// tslint:disable-next-line:max-line-length
		var myJSON = JSON.parse(JSON.stringify(body));

		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};

		const url = environment.prodAdbApi + '/ADB/api/editprofile';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}

	getProfile(): Observable<any> {
		// tslint:disable-next-line:max-line-length
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/editprofile';
		const response = this.http.get(url, headers);
		return response;
	}

	request_access(body: any): Observable<any> {
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
				...body,
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/intent';
		const response = this.http.post(url, {}, headers);
		return response;
	}

	async logout() {
		const authToken = localStorage.getItem('auth_token');
		const refreshToken = localStorage.getItem('refresh_token');
		if (authToken && refreshToken) {
			await this.revokeToken().subscribe();
			await this.refreshRevokeToken().subscribe();
		}
		await localStorage.clear();
		this.deleteAllCookies();
		this.router.navigate(['login']);
	}

	deleteAllCookies() {
		this.cookieService.deleteAll();
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			this.domainName = window.location.hostname;
			this.domainName = this.domainName.substring(this.domainName.indexOf('.') + 1);
			//
			if (
				name === ' amp_u' ||
				name === 'amp_u' ||
				name === 'email_id' ||
				name === ' email_id' ||
				name === 'ampliz_uid' ||
				name === ' ampliz_uid'
			) {
			} else {
				document.cookie =
					name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=.' + this.domainName;
			}
		}
	}
	downloadCsv(): Observable<HttpResponse<string>> {
		const authToken = localStorage.getItem('auth_token');
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + authToken,
			responseType: 'blob',
			Accept: 'text/csv; charset=utf-8',
		});
		const url = environment.prodAdbApi + '/ADB/api/export';
		const response = this.http.post(
			url,
			{},
			{
				headers: headers,
				observe: 'response',
				responseType: 'text',
			}
		);
		//
		return response;
	}
	paymentAction(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));

		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};

		const url = environment.prodAdbApi + '/ADB/api/paypal';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}
	paymentHistory(): Observable<any> {
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};

		const url = environment.prodAdbApi + '/ADB/api/paymentHistory';
		const response = this.http.get(url, headers);
		return response;
	}

	checkSubscriptionStatus(): Observable<any> {
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};

		const url = environment.prodAdbApi + '/ADB/api/checkSubscriptionStatus';
		const response = this.http.get(url, headers);
		return response;
	}

	cancleSubscription(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));
		//
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};

		const url = environment.prodAdbApi + '/ADB/api/cancleSubscription';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}

	chromeStatus(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));
		//
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};

		const url = environment.prodAdbApi + '/ADB/api/chrome';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}

	getReport(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		// const url = "https://go.ampliz.com/ADB/api/get-reports";
		const url = environment.prodAdbApi + '/ADB/api/get-reports';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}

	icpSelectedFiltersSave(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		// const url = "https://go.ampliz.com/ADB/api/sample";
		const url = environment.prodAdbApi + '/ADB/api/sample';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}

	icpDataAccessReq(body: any): Observable<any> {
		var myJSON = JSON.parse(JSON.stringify(body));
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		// const url = "https://go.ampliz.com/ADB/api/getfullaccess";
		const url = environment.prodAdbApi + '/ADB/api/getfullaccess';
		const response = this.http.post(url, myJSON, headers);
		return response;
	}

	domainSearch(body: any): Observable<any> {
		//
		const headers = {
			headers: new HttpHeaders({
				url: body,
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		// const url = "https://go.ampliz.com/ADB/api/companydetails";
		const url = environment.prodAdbApi + '/ADB/api/companydetails';
		const response = this.http.post(url, {}, headers);
		return response;
	}

	requestCompany(id: any, siteurl, intent): Observable<any> {
		if (id === undefined) {
			id = 0;
		}
		const headers = new HttpHeaders({
			comid: id.toString(),
			url: siteurl,
			intentrequest: intent.replace(/[\r\n]+/gm, ' '),
			Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
		});
		const url = environment.prodAdbApi + '/ADB/api/intent';
		// const url = "https://go.ampliz.com/ADB/api/intent";
		const response = this.http.post(url, {}, { headers });
		return response;
	}

	apacCompany(body: any): Observable<any> {
		//
		const headers = {
			headers: new HttpHeaders({
				url: body,
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		// const url = "https://go.ampliz.com/ADB/api/apaccompanydetails";
		const url = environment.prodAdbApi + '/ADB/api/apaccompanydetails';
		const response = this.http.post(url, {}, headers);
		return response;
	}

	getPrice(body: any): Observable<any> {
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		const url = environment.prodAdbApi + '/ADB/api/getprice';
		const response = this.http.post(url, body, headers);
		return response;
	}

	getSearchData(body: any): Observable<any> {
		//const headers = {headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token')})};
		const url = environment.prodHcApi + '/amplizhcreadapi/search/search-summary';
		const response = this.http.post(url, body);
		return response;
	}

	createList(listName: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/create-list';
		const body = { listName: listName, autoCreated: false, organizationId: this.organizationId };
		//const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
		const response = this.http.post(url, body);
		return response;
	}

	getAllList(offset: any, count: any, autoCreated: any = true, listType?: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/list/get-all-list';
		const body = {
			offset: offset,
			count: count,
			autoCreated: autoCreated,
			listType: listType ? listType : 'Mylist',
			organizationId: this.organizationId,
		};
		// const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
		const response = this.http.get(url, { params: body });
		return response;
	}

	deleteList(listId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/delete-list';
		const body = { listId: listId };
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
			}),
		};
		const response = this.http.post(url, body, headers);
		return response;
	}

	searchList(listName: string, offset: string, count: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/list/search-list';
		const body = { listName: listName, offset: offset, count: count };
		// const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
		const response = this.http.get(url, { params: body });
		return response;
	}

	exportList(listId: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/list/export-list';
		const body = { listId: listId };
		const headers = {
			headers: new HttpHeaders({
				Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
				responseType: 'blob',
			}),
		};
		const response = this.http.get(url, { params: body });
		return response;
	}

	searchPhysician(parameter: SearchPhysicianModel): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/search-physician';
		// console.log(parameter, data);
		const bodyN = {
			serachInput: parameter.toJson(),
		};
		// const body = parameter;
		const response = this.http.post(url, bodyN);
		return response;
	}
	searchPhysicianForSpeciality(data: SearchPhysicianModel): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/user/search-physician-for-speciality-user';
		// console.log(parameter, data);
		const bodyN = {
			serachInput: data,
		};
		// const body = parameter;
		const response = this.http.post(url, bodyN);
		return response;
	}
	getSpecialityUsersExportCsv(data: SearchPhysicianModel): Observable<any> {
		const authToken = localStorage.getItem('auth_token');

		const url = environment.prodHcApi + '/amplizhcreadapi/user/get-speciality-users-export-csv';
		// console.log(url);
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + authToken,
			responseType: 'blob',
			Accept: 'application/json; charset=utf-8',
		});
		const bodyN = {
			serachInput: data,
		};
		const response = this.http.post(url, bodyN, {
			headers: headers,
			observe: 'response',
			responseType: 'blob',
		});
		// const response = this.http.post(url, bodyN,{...headers,observe: "response",
		//   responseType: "blob",});
		return response;
		// console.log(response);
	}
	//  downloadCSVAll(listId: any): Observable<any> {
	//   const headers = new HttpHeaders({
	//     responseType: "blob",
	//     Accept: "application/json; charset=utf-8",
	//   });
	//   const body = { listId: listId };

	//   const url = environment.prodHcApi + "/amplizhcreadapi/list/export-list";
	//   console.log(url)
	//   const response = this.http.get(url, {
	//     params: body,
	//     headers: headers,
	//     observe: "response",
	//     responseType: "blob",
	//   });
	//   return response;
	// }
	getStateList(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-state-list';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}
	getCitylList(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-city-list-for-state';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}
	getHospitalList(parameter: any) {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-hospital-list';
		const body = parameter;

		const response = this.http.get(url, { params: body });
		return this.hospitals.length
			? of(this.hospitals)
			: this.http.get(url, { params: body }).pipe(tap((data) => (this.hospitals = data)));
		// return response;
	}
	getHospitalTypeList(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-hospital-type-list';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}
	getLevelList(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-level';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}
	getDepartmentList(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-department-list';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}

	getTitleList(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-title-list';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}
	//   return response;
	// }

	// exportList(listId: string, offset: string, count: string): Observable<any> {
	//   const url = environment.prodHcApi+"/amplizhcreadapi/list/export-list";
	//   const body = { listId: listId, offset: offset, count: count };
	//   const headers = {
	//     headers: new HttpHeaders({
	//       Authorization: "Bearer " + localStorage.getItem("auth_token"),
	//       responseType: "blob",
	//     }),
	//   };
	//   const response = this.http.get(url, { params: body });
	//   return response;
	// }

	// searchPhysician(parameter: any): Observable<any> {
	//   const url = environment.prodHcApi+"/amplizhcreadapi/search/search-physician";
	//   const body = parameter;
	//   const response = this.http.get(url, { params: body });
	//   return response;
	// }
	searchExecutive(parameter: any, data?: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/search-health-executive';

		const params = parameter;
		const response = this.http.post(url, data, { params: params });
		return response;
	}
	physicianOverviewDetails(physicianId: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-physician-detail';
		const body = { physicianId: physicianId };
		const response = this.http.get(url, { params: body });
		return response;
	}
	getPhysicianDetailsUnmasked(physicianId: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-physician-detail-unmasked';
		const body = { physicianId: physicianId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	executiveOverviewDetails(executiveId: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-health-executive-detail';
		const body = { healthExeId: executiveId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getExecutiveDetailsUnmasked(healthExeId: string): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/search/get-health-executive-detail-unmasked';
		const body = { healthExeId: healthExeId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	hospitalOverviewDetails(hospitalId: string): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-hospital-detail';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	// searchPhysician(parameter: any): Observable<any> {
	//   const url = 'amplizhcreadapi/search/search-physician';
	//   // const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
	//   const body = parameter;
	//   const response = this.http.get(url, {params: body, headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') })});
	//   return response;
	// }

	searchHospital(parameter: any, body: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/search-hospital';
		const params = parameter;
		const response = this.http.post(url, body, { params: params });
		return response;
	}

	viewPhysicianFromList(physicianId: any, listId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/add-physician-to-list';
		const body = { physicianId: physicianId, listId: listId, organizationId: this.organizationId };
		//const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
		const response = this.http.post(url, body);
		return response;
	}

	viewExecutiveFromList(executiveId: any, listId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/add-health-executive-to-list';
		const body = {
			healthExecutiveId: executiveId,
			listId: listId,
			organizationId: this.organizationId,
		};
		//const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
		const response = this.http.post(url, body);
		return response;
	}

	reportIncorrectPhysicianData(physicianId: any, incorrectDataList: string[]): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-physician-data';
		const body = {
			physicianId: physicianId,
			incorrectDataList: incorrectDataList,
		};
		const response = this.http.post(url, body);
		return response;
	}

	reportIncorrectExecutiveData(executiveId: any, incorrectDataList: []): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-executive-data';
		const body = {
			healthExecutiveId: executiveId,
			incorrectDataList: incorrectDataList,
		};
		const response = this.http.post(url, body);
		return response;
	}

	reportIncorrectHospitalData(hospitalId, incorrectDataList: []): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcwriteapi/customervoice/report-incorrect-hospital-data';
		const body = {
			hospitalId: hospitalId,
			incorrectDataList: incorrectDataList,
		};
		const response = this.http.post(url, body);
		return response;
	}

	getListDetails(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/list/get-list-detail';
		const body = parameter;
		const response = this.http.get(url, { params: body });
		return response;
	}

	saveLeadName(listId: string, listName: string) {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/edit-list-name';
		const body = { listId: listId, listName: listName, organizationId: this.organizationId };
		const response = this.http.post(url, body);
		return response;
	}

	removeDataFromList(listId: string, leadIdList: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/remove-data-from-list';
		const body = { listid: listId, leadIdList: leadIdList };
		const response = this.http.post(url, body);
		return response;
	}

	getAllState(): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-state-list';
		const response = this.http.get(url);
		return response;
	}

	getCityListForState(stateId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-city-list-for-state';
		const body = { stateId: stateId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	searchLead(parameter: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/list/search-leads';
		//let headers = new HttpHeaders().set('Content-Type', 'application/json');

		const response = this.http.post(url, parameter);
		return response;
	}

	downloadExcel(listId: any, leadsIdList: []): Observable<any> {
		const authToken = localStorage.getItem('auth_token');
		const body = { listId: listId, leadsIdList: leadsIdList };
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + authToken,
			responseType: 'blob',
			Accept: 'application/json; charset=utf-8',
		});
		const url = environment.prodHcApi + '/amplizhcreadapi/list/export-selected-list';
		const response = this.http.post(url, body, {
			headers: headers,
			observe: 'response',
			responseType: 'blob',
		});
		return response;
	}

	downloadCSV(listId: any, leadsIdList: []): Observable<any> {
		const headers = new HttpHeaders({
			responseType: 'blob',
			Accept: 'application/json; charset=utf-8',
		});
		const body = { listId: listId, leadsIdList: leadsIdList };

		const url = environment.prodHcApi + '/amplizhcreadapi/list/export-selected-list';
		const response = this.http.post(url, {
			params: body,
			headers: headers,
			observe: 'response',
			responseType: 'blob',
		});
		return response;
	}

	downloadCSVAll(listId: any): Observable<any> {
		const headers = new HttpHeaders({
			responseType: 'blob',
			Accept: 'application/json; charset=utf-8',
		});
		const body = { listId: listId };

		const url = environment.prodHcApi + '/amplizhcreadapi/list/export-list';
		// console.log(url);
		const response = this.http.get(url, {
			params: body,
			headers: headers,
			observe: 'response',
			responseType: 'blob',
		});
		return response;
	}

	getHospitalSpecification(hospitalId: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-hospital-specification';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalEarning(hospitalId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-hospital-earnings';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalStats(hospitalId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-hospital-stats';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getTotalStats(hospitalId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-total-stats';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalFinacialEarning(hospitalId: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-hospital-financial-earnings';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalFinancialCostandBudget(hospitalId: any): Observable<any> {
		const url =
			environment.prodHcApi +
			'/amplizhcreadapi/hospitaloverview/get-hospital-financial-cost-and-budget';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalFinancialIncomeandEbitda(hospitalId: any): Observable<any> {
		const url =
			environment.prodHcApi +
			'/amplizhcreadapi/hospitaloverview/get-hospital-financial-income-and-e-b-i-t-d-a';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalFinancialAssets(hospitalId: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-hospital-financial-assets';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getHospitalFinancialLiabilities(hospitalId: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/hospitaloverview/get-hospital-financial-liabilities';
		const body = { hospitalId: hospitalId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getPhysicianPrescriberDrugDetail(physicianId: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/search/get-physician-prescriber-drug-detail';
		const body = { physicianId: physicianId };
		const response = this.http.get(url, { params: body });
		return response;
	}

	getNPINumberList(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-npi-number-list';
		// const body = { searchPhase: searchPhase };
		const response = this.http.get(url, { params: params });
		return response;
	}
	getNumberOfBedList(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-bed-range-list';
		const response = this.http.get(url, { params: params });
		return response;
	}
	getSpecialityList(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-speciality-all-auto-suggest';
		// const body = { searchPhase: searchPhase };
		const response = this.http.post(url, params);
		return response;
	}
	getSpecialityListForSpecialityUser(params: any): Observable<any> {
		const url =
			environment.prodHcApi +
			'/amplizhcreadapi/general/get-speciality-all-auto-suggest-for-speciality-user';
		// const body = { searchPhase: searchPhase };
		const response = this.http.post(url, params);
		return response;
	}
	getSpecialitySuggestion(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/get-speciality-related-term';
		// const body = { searchPhase: searchPhase };
		const response = this.http.post(url, params);
		return response;
	}
	searchCitiesForStates(params: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/general/search-city-for-state-list';
		const response = this.http.post(url, params);
		return response;
	}

	generateApiKey(): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/enterprize/generate-api-key';
		const params = {};
		const response = this.http.post(url, {});
		return response;
	}

	getSavedApiKey(): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/enterprize/get-api-key-for-user';
		const response = this.http.get(url);
		return response;
	}
	getPhysicianListForHospital(params: any): Observable<any> {
		const body = params;
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-physician-list-for-hospital';
		const response = this.http.get(url, { params: body });
		return response;
	}

	getExecutiveListForHospital(params: any): Observable<any> {
		const body = params;
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-executive-list-for-hospital';
		const response = this.http.get(url, { params: body });
		return response;
	}

	getPhysicianNetNewCount(data: SearchPhysicianModel): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-physician-net-new-count';
		const response = this.http.post(url, data);
		return response;
	}

	getExecutiveNetNewCount(params: any, data?: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/search/get-health-executive-net-new-count';
		const body = params;
		const response = this.http.post(url, data, { params: body });
		return response;
	}
	requestSpecialitySearch(data: any) {
		const url = environment.prodHcApi + '/amplizhcwriteapi/user/request-speciality-access';
		const response = this.http.post(url, data);
		return response;
	}
	requestSpecialitySearchEx(data: any) {
		const url = environment.prodHcApi + '/amplizhcwriteapi/user/request-executive-access';
		const response = this.http.post(url, data);
		return response;
	}

	addLeadsToList(data: any) {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/add-leads-to-list';
		const response = this.http.post(url, { ...data, organizationId: this.organizationId });
		return response;
	}

	savePhysicianAsPerCount(data: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcwriteapi/savedlist/save-physician-records-as-per-count';
		const response = this.http.post(url, { ...data, organizationId: this.organizationId });
		return response;
	}

	saveExecutiveAsPerCount(data: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcwriteapi/savedlist/save-executive-records-as-per-count';
		const response = this.http.post(url, { ...data, organizationId: this.organizationId });
		return response;
	}
	isInvitationActive(code: any): Observable<any> {
		let params = { invitationCode: code };
		// const url = environment.prodHcApi + '/amplizb2bapacreadapi/user/is-invitation-active';
		const url = environment.prodGlobalB2BApi + '/amplizglobalb2breadapi/user/is-invitation-active';
		// const body = { searchPhase: searchPhase };
		const response = this.http.get(url, { params: params });
		return response;
	}
	reInvite(code: any): Observable<any> {
		const body = { invitationCode: code };
		const url = environment.prodGlobalB2BApi + '/amplizglobalb2bwriteapi/user/request-invitation';
		// environment.prodHcApi +
		// "/amplizb2bapacwriteapi/user/re-invite-team-member";
		const response = this.http.post(url, body);
		return response;
	}

	saveDraftLeads(): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/save-draft-leads';
		const response = this.http.post(url, { organizationId: this.organizationId });
		return response;
	}

	saveViewedLeads(physicianId: any, listId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcwriteapi/savedlist/save-viewed-lead';
		const body = { leadId: physicianId, listId: listId, organizationId: this.organizationId };
		//const headers = { headers: new HttpHeaders({Authorization: 'Bearer ' + localStorage.getItem('auth_token') }) };
		const response = this.http.post(url, body);
		return response;
	}

	getIpAddress(): Observable<any> {
		const url = 'https://api.ipify.org?format=json';
		return this.http.get(url);
	}

	allocateOneTimeCredit(body) {
		const url = environment.prodAdbApi + '/ADB/api/allocate-one-time-credit-to-team-member';
		const response = this.http.post(url, body);
		return response;
	}

	allocateReccuringCredit(body) {
		const url = environment.prodAdbApi + '/ADB/api/allocate-recurring-credit-to-team-member';
		const response = this.http.post(url, body);
		return response;
	}

	sendInviteToTeamMember(body: any): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/send-invite-to-team-member';
		const response = this.http.post(url, body);
		return response;
	}

	removeTeamMember(body: any): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/remove-user';
		const response = this.http.post(url, body);
		return response;
	}

	getSeatAndCreditStatus(): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/get-seat-and-credit-status';
		const response = this.http.get(url);
		return response;
	}

	getPendingUserList(): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/get-pending-user-list';
		const response = this.http.get(url);
		return response;
	}

	getActiveUserList(): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/get-active-user-list';
		const response = this.http.get(url);
		return response;
	}

	inviteeSignUp(body: any): Observable<any> {
		// const url = environment.prodAdbApi + "/ADB/api/signup";
		const url = environment.prodAdbApi + '/ADB/api/invitee-signup';
		const response = this.http.post(url, body);
		return response;
	}

	reSendInviteToTeamMember(body: any): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/re-invite-team-member';
		const response = this.http.post(url, body);
		return response;
	}

	verifyEmailSignup(body) {
		const url = environment.prodAdbApi + '/ADB/api/email-verification';
		const response = this.http.post(url, body);
		return response;
	}

	regenerateVerificationCode(body) {
		console.log(JSON.stringify(body));
		const url = environment.prodAdbApi + '/ADB/api/regenerate-verification-code';
		const response = this.http.post(url, body);
		return response;
	}
	getEmailCountForNPI(bulkNpiId: any, withFilter: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-email-record-counts';
		const params = { bulkNpiId, withFilter };
		const response = this.http.get(url, { params });
		return response;
	}
	getPhoneCountForNPI(bulkNpiId: any, withFilter: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-phone-record-counts';
		const params = { bulkNpiId, withFilter };
		const response = this.http.get(url, { params });
		return response;
	}
	getSpecialityListNPI(bulkNpiId: any, withFilter: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-speciality-record-counts';
		const params = { bulkNpiId, withFilter };
		const response = this.http.get(url, { params });
		return response;
	}
	getStateListNPI(bulkNpiId: any, withFilter: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-state-record-counts';
		const params = { bulkNpiId, withFilter };
		const response = this.http.get(url, { params });
		return response;
	}
	getCityListNPI(bulkNpiId: any, withFilter: any): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-city-record-counts';
		const params = { bulkNpiId, withFilter };
		const response = this.http.get(url, { params });
		return response;
	}
	uploadNpiFile(formData: FormData): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/npi/upload-npi-numbers';
		const response = this.http.post(url, formData);
		return response;
	}

	getUploadFileListNpi(offset, count): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-npi-file-upload-list';
		const response = this.http.get(url, {
			params: { offset, count },
		});
		return response;
	}
	downloadPhysicianData(
		bulkNpiId: string,
		withFilter: string,
		fileName: string,
		recordCount: number
	): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/download-bulk-npi-physician-data';
		const response = this.http.get(url, {
			params: { bulkNpiId, withFilter, fileName, recordCount, organizationId: this.organizationId },
			responseType: 'text',
		});
		return response;
	}
	downloadPhysicianDataPDF(bulkNpiId: string): Observable<any> {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/download-bulk-npi-report';
		const response = this.http.get(
			url,

			{
				params: { bulkNpiId },
			}
		);
		return response;
	}
	npiReportSummary(bulkNpiId: string) {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-npi-report-summary';
		const response = this.http.get(url, { params: { bulkNpiId } });
		return response;
	}
	npiDownloadNumbers(bulkNpiId: string) {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-all-filter-count';
		const response = this.http.get(url, { params: { bulkNpiId } });
		return response;
	}
	npiDownloadAgainList(bulkNpiId: string) {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-bulk-npi-download-again-list';
		const response = this.http.get(url, { params: { bulkNpiId } });
		return response;
	}
	npiDownloadAgain(bulkNpiId: string, withFilter: string, fileName: string) {
		const url =
			environment.prodNPIApi + '/amplizhcreadapi/npi/download-bulk-npi-physician-data-again';
		const response = this.http.get(url, {
			params: { bulkNpiId, withFilter, fileName, organizationId: this.organizationId },
			responseType: 'text',
		});
		return response;
	}
	npiReportStatus(bulkNpiId: string) {
		const url = environment.prodNPIApi + '/amplizhcreadapi/npi/get-bulk-npi-matching-status';
		const response = this.http.get(url, {
			params: { bulkNpiId },
		});
		return response;
	}
	viewPhysicianMobileNumber(physicianId: string) {
		const url = environment.prodNPIApi + '/amplizhcwriteapi/savedlist/add-physician-mobile-to-list';
		const response = this.http.post(url, {
			physicianId,
			organizationId: this.organizationId,
		});
		return response;
	}
	viewPhysicianEmail(physicianId: string) {
		const url =
			environment.prodNPIApi + '/amplizhcwriteapi/savedlist/add-physician-email-and-phone-to-list';
		const response = this.http.post(url, {
			physicianId,
			organizationId: this.organizationId,
		});
		return response;
	}
	getExperienceList(params: any): Observable<any> {
		const url =
			environment.prodHcApi + '/amplizhcreadapi/general/get-physician-experience-suggestion-list';
		// const body = { searchPhase: searchPhase };
		const response = this.http.get(url, { params: params });
		return response;
	}
}
