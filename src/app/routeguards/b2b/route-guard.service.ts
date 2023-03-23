import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor() { }

  public async canActivate(route: ActivatedRouteSnapshot){
    let user = await localStorage.getItem('Dataset') as string;
    if(user === 'B2B'){
      return true;
    }
    return false;
  }
}
