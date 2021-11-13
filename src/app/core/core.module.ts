import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth-services/auth.service';
import { AuthGuardService } from '../auth-services/auth-guard.service';
import { InterrogatorModule } from '../interrogator/interrogator.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    AuthService,
    AuthGuardService
  ]
})
export class CoreModule { }
