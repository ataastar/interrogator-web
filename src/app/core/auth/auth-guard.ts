import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (state.url !== '/login' && !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    if (state.url == '/login' && this.authService.isLoggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
