
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardHCService implements CanActivate {

  constructor() { }

  public async canActivate(route: ActivatedRouteSnapshot){
    let user = await localStorage.getItem('Dataset') as string;
    if(user === 'healthcare'){
      return true;
    }
    return false;
  }
}

