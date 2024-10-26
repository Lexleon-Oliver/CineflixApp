import { UserInMainService } from './../services/user-in-main.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private router: Router,
    private userService: UserInMainService){}

  checkIfUserHasToken(){
    if(this.userService.getCurrentUser() != null && this.userService.getCurrentUser().id>0){
      return true;
    }else{
      return false;
    }
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //Irá realizar o método acima e caso não haja token é direcionado para tela de login.
      const shouldProceed = Boolean(this.checkIfUserHasToken());
      if(shouldProceed) return true
      return this.router.navigate(["users"])
  }

}
