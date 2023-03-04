import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, concatMap, delay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing: boolean;

  constructor(public authService: AuthService, public router: Router) {
  }

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = this.authService.getToken();

    if (idToken) {
      const cloned = this.addTokenToHeader(req, idToken);
      return next.handle(cloned).pipe(catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      }));
    } else {
      return next.handle(req);
    }
  }

  private addTokenToHeader(req, idToken = this.authService.getToken()) {
    return req.clone({
      headers: req.headers.set('Authorization',
        'Bearer ' + idToken)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      if (this.authService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;
            const cloned = this.addTokenToHeader(request);
            return next.handle(cloned);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            if (error.status == '403' || error.status == '401') {
              this.authService.logout();
              this.router.navigate(['login']).then(() => {
              });
            }
            return throwError(() => error);
          })
        );
      }
    }
    return this.waitForRefresh(request, next);
  }

  private waitForRefresh(request, next) {
    return from([1]).pipe(concatMap(item => of(item).pipe(delay(1000)).pipe(switchMap(() => {
      if (this.isRefreshing) {
        return this.waitForRefresh(request, next);
      }
      return next.handle(this.addTokenToHeader(request));
    }))));
  }

}
