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
		const response = this.http.post(url, params);
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

	// GET API

	getTeamMemberList(params): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamsreadapi/admin/get-users-list';
		const response = this.http.get(url, { params: params });
		return response;
	}
	getMemberCreditDetails(params): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamsreadapi/admin/get-user-credit-details';
		const response = this.http.get(url, { params: params });
		return response;
	}
	getAdminDetails(): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamsreadapi/admin/get-admin-details';
		const response = this.http.get(url);
		return response;
	}
}
