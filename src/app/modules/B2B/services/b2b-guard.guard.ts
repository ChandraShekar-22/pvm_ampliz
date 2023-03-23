import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class B2bGuard implements CanActivate {
  constructor( private routes: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const dataset = localStorage.getItem("Dataset") as string;
      if(dataset!='B2B') {
        this.routes.navigate(['/hcdashboard']);
      }
    return (dataset=='B2B');
  }
  
}
