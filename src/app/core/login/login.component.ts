import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth-services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
        .subscribe(
          () => {
            console.log('User is logged in');
            this.router.navigate(['interrogator']).then(s =>
              window.location.reload()
            );
          }
        );
    }
  }
}
