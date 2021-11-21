import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    // TODO handle logout after x amount of time
    // clear id_token from the localStorage
    // timeout parameter as datetime in storage, check if current time is before -> no clear storage (id_token) -> yes update timeout with eg 5 minutes

    const idToken = localStorage.getItem("id_token");

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + idToken)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
