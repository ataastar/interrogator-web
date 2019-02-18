import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth-services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private authentication: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login(username, password) {
		this.authentication.login(username, password);
	}

}
