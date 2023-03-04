import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { InterrogatorComponent } from '../interrogator/interrogator.component';
import { ShowPhrasesComponent } from '../interrogator/show-phrases/show-phrases.component';
import { AddUnitContentComponent } from '../admin/add-unit-content/add-unit-content.component';
import { WordTypesComponent } from '../interrogator/word-type/display/word-types.component';
import { DisplayWordTypeUnitContentComponent } from '../interrogator/word-type/display-word-type-unit-content.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'interrogator',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent, canActivate: [AuthGuard]
  },
  /*{
    path: 'admin',
    canActivate: [AuthGuardService],
    loadChildren: '../admin/admin.module#AdminModule'
  },*/
  {
    path: 'admin/addUnitContent/:id',
    component: AddUnitContentComponent, canActivate: [AuthGuard]
},
  {
    path: 'interrogator/show/:id',
    component: ShowPhrasesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'interrogator/:id',
    component: InterrogatorComponent, canActivate: [AuthGuard]
  },
  {
    path: 'interrogator',
    component: InterrogatorComponent, canActivate: [AuthGuard]
  },
  { // admin page to add phrase to word type unit
    path: 'wordType',
    component: WordTypesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'wordTypeUnit/:id',
    component: DisplayWordTypeUnitContentComponent, canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
