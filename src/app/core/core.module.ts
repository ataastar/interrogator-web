import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { InterrogatorModule } from '../interrogator/interrogator.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    CoreRoutingModule,
    InterrogatorModule
  ],
  declarations: [LoginComponent, NotFoundComponent],
  exports: [
    RouterModule,
    LoginComponent
  ],
  providers: [
    AuthService
  ]
})
export class CoreModule {
}
