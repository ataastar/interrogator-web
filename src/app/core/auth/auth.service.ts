import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { CanActivateFn } from '@angular/router';

@Injectable()
export class AuthService {

  public static TOKEN_ID = 'id_token';
  public static REFRESH_TOKEN_ID = 'refresh_token';
  public static ROLES_ID = 'roles';

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string) {
    return this.http.post(env.apiUrl + '/api/login', { email, password })
      .pipe(tap(authResult => {
            this.doLogin(authResult);
          }
        )
      )
      .pipe(shareReplay(1));
  }

  refreshToken() {
    //console.log('refresh token');
    return this.http.post(env.apiUrl + '/api/refreshToken', { refreshToken: localStorage.getItem(AuthService.REFRESH_TOKEN_ID) })
      .pipe(tap(authResult => {
        //console.log('refresh arrived');
        this.doLogin(authResult);
      }));
  }

  private doLogin(authResult) {
    localStorage.setItem(AuthService.TOKEN_ID, authResult.idToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_ID, authResult.refreshToken);
    localStorage.setItem(AuthService.ROLES_ID, authResult.roles);
  }

  logout() {
    localStorage.clear();
  }

  public getToken() {
    return localStorage.getItem(AuthService.TOKEN_ID);
  }

  public isLoggedIn() {
    return this.getToken() != null;
  }

  public hasRole(role: string) {
    for (const userRole of localStorage.getItem(AuthService.ROLES_ID).split(',')) {
      if (role === userRole) {
        return true;
      }
    }
    return false;
  }

}

export const isAdmin: CanActivateFn =
  () => {
    return inject(AuthService).hasRole('admin');
  };
