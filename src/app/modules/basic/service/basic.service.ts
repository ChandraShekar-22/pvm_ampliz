import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs-compat';
@Injectable({
	providedIn: 'root',
})
export class BasicService {
	teams_api: string = 'https://test.ampliz.com';
	constructor(private http: HttpClient) {}

	// Teams Post API
	setTeamMemberPassword(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/set-password';
		const response = this.http.post(url, params);
		return response;
	}

	verifyTeamEmail(params: any): Observable<any> {
		const url = this.teams_api + '/teams/amplizteamswriteapi/admin/email-verification';
		const response = this.http.post(url, params);
		return response;
	}
}
