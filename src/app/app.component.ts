import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'learn-english-app',
  templateUrl: './app.component.html',
})
export class AppComponent {


  constructor(private router: Router, private authService: AuthService) {}

  // TODO logout to separated component and put global logout somewhere
  public logout() {
    localStorage.removeItem(AuthService.TOKEN_ID);
    this.router.navigate(['login']).then(() => {/* navigated*/});
  }

  public logoutEnabled(): boolean {
    return this.authService.isLoggedIn();
  }
}
