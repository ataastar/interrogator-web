import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService, public router: Router) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = this.authService.getToken();

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + idToken)
      });

      return next.handle(cloned).pipe(tap(() => {
        },
        (err: any) => {
          this.handleResponse(err)
        }));
    } else {
      return next.handle(req).pipe(tap(() => {
        },
        (err: any) => {
          this.handleResponse(err)
        }));
    }
  }

  private handleResponse(err: any) {
    console.log(err);
    if (err instanceof HttpErrorResponse) {
      if (err.status !== 401) {
        return;
      }
      // TODO refresh token e.g. https://www.bezkoder.com/angular-12-refresh-token/
      this.authService.logout();
      this.router.navigate(['login']).then(() => {/* navigated*/
      });
    }
  }
}
