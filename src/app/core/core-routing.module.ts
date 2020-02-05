import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from '../auth-services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { InterrogatorComponent } from '../interrogator/interrogator.component';
import { ShowPhrasesComponent } from '../interrogator/show-phrases/show-phrases.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'interrogator',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuardService],
    loadChildren: '../admin/admin.module#AdminModule'
  },
  {
    path: 'interrogator/show/:id',
    component: ShowPhrasesComponent
  },
  {
    path: 'interrogator/:id',
    component: InterrogatorComponent
  },
  {
    path: 'interrogator',
    component: InterrogatorComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
