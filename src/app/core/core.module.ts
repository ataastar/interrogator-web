import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth-services/auth.service';
import { InterrogatorModule } from '../interrogator/interrogator.module';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    InterrogatorModule
  ],
  declarations: [LoginComponent, NotFoundComponent],
  exports: [
    RouterModule
  ],
  providers: [
    AuthService
  ]
})
export class CoreModule { }
