import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string) {
    return this.http.post(env.apiUrl + '/api/login', {email, password})
      .pipe(tap(authResult => {
            this.setSession(authResult)
          }
        )
      )
      .pipe(shareReplay(1));
  }

  private setSession(authResult) {
    //const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    //localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    //localStorage.removeItem('expires_at');
  }

   public getToken() {
     return localStorage.getItem("id_token");
   }

   public isLoggedIn() {
     return this.getToken() != null;
   }
/*
   isLoggedOut() {
     return !this.isLoggedIn();
   }

   getExpiration() {
     const expiration = localStorage.getItem('expires_at');
     const expiresAt = JSON.parse(expiration);
     return moment(expiresAt);
   }*/
}
