import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';

@Injectable()
export class AuthService {

  public static TOKEN_ID = 'id_token';
  public static REFRESH_TOKEN_ID = 'refresh_token';

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string) {
    return this.http.post(env.apiUrl + '/api/login', { email, password })
      .pipe(tap(authResult => {
        this.setSession(authResult);
      }
      )
      )
      .pipe(shareReplay(1));
  }

  refreshToken() {
    console.log('refresh token');
    return this.http.post(env.apiUrl + '/api/refreshToken', { refreshToken: localStorage.getItem(AuthService.REFRESH_TOKEN_ID) })
      .pipe(tap(authResult => {
        console.log('refresh arrived');
        this.setSession(authResult);
      }));
  }

  private setSession(authResult) {
    localStorage.setItem(AuthService.TOKEN_ID, authResult.idToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_ID, authResult.refreshToken);
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

}
