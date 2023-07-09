import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs-compat';
@Injectable({
	providedIn: 'root',
})
export class BasicService {
	teams_api: string = 'https://test.ampliz.com';
	constructor(private http: HttpClient) {}

	// Teams
	// POST API
	setTeamMemberPassword(params: any): Observable<any> {
		const url = environment.prodAdbApi + '/ADB/api/setpwd';
		const headers = new HttpHeaders({ ...params });
		const response = this.http.post(url, {}, { headers });
		return response;
	}

	verifyTeamEmail(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/email-verification';
		const response = this.http.post(url, params);
		return response;
	}

	inviteTeamMember(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/invite-users-to-org';
		const response = this.http.post(url, params);
		return response;
	}

	activateTeamMember(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/activate-user';
		const response = this.http.post(url, params);
		return response;
	}

	deactivateTeamMember(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/deactivate-user';
		const response = this.http.post(url, params);
		return response;
	}

	regenerateInviteLink(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/regenerate-invite-link';
		const response = this.http.post(url, params);
		return response;
	}

	updateCredits(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/edit-user-credit';
		const response = this.http.post(url, params);
		return response;
	}

	getTeamMemberList(body: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamsreadapi/admin/get-member-list';
		const response = this.http.post(url, body);
		return response;
	}

	createInviteLink(body: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/regenerate-invite-link';
		const response = this.http.post(url, body);
		return response;
	}

	activateUser(body: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/activate-user';
		const response = this.http.post(url, body);
		return response;
	}

	deactivateUser(body: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/deactivate-user';
		const response = this.http.post(url, body);
		return response;
	}

	// GET API

	getMemberCreditDetails(body: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamsreadapi/admin/get-user-credit-details';
		const response = this.http.get(url, { params: body });
		return response;
	}

	getAdminDetails(): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamsreadapi/admin/get-admin-details';
		const response = this.http.get(url);
		return response;
	}

	getUserList(offset: any, count: any, userId: any): Observable<any> {
		const url = environment.prodHcApi + '/amplizhcreadapi/list/get-user-list';
		const body = {
			offset: offset,
			count: count,
			userId: userId,
		};
		const response = this.http.get(url, { params: body });
		return response;
	}
}
