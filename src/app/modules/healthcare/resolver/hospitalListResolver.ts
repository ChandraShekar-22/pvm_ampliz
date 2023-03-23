import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { take, map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class HospitalListResolver implements Resolve<any> {
  constructor(private amplizRequest: AmplizService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // In my case i am using custom service for getting rest calls but you can use simple http.get()...
    return this.amplizRequest.getHospitalList(null).pipe(
      take(1),
      map((hospitals) => hospitals)
    );
  }
}
