import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonFunctionsService } from 'src/app/modules/basic/common/common-functions.service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ErrorInterceptorService {
	constructor(private commonFunction: CommonFunctionsService, private router: Router) {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				let errorMsg = 'Error occured';
				console.log(error, 'Err');
				if (error instanceof HttpErrorResponse) {
					this.handleError(error);
				} else {
					return throwError(errorMsg);
				}
				return throwError(error);
			})
		);
	}

	handleError(error: HttpErrorResponse) {
		if (error.status == 412 || error.status == 500 || error.status == 400 || error.status == 404) {
			this.commonFunction.displayError(error);
		} else if (error.status == 401) {
			this.logout();
		}
	}

	async logout() {
		await localStorage.clear();
		this.router.navigate(['login']);
	}
}
