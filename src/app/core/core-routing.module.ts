import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { InterrogatorComponent } from '../interrogator/interrogator.component';
import { ShowPhrasesComponent } from '../interrogator/show-phrases/show-phrases.component';
import { AddUnitContentComponent } from '../admin/add-unit-content/add-unit-content.component';
import { WordTypesComponent } from '../interrogator/word-type/display/word-types.component';
import { DisplayWordTypeUnitContentComponent } from '../interrogator/word-type/display-word-type-unit-content.component';

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
  /*{
    path: 'admin',
    canActivate: [AuthGuardService],
    loadChildren: '../admin/admin.module#AdminModule'
  },*/
  {
    path: 'admin/addUnitContent/:id',
    component: AddUnitContentComponent
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
    path: 'wordType',
    component: WordTypesComponent
  },
  {
    path: 'wordTypeUnit',
    component: DisplayWordTypeUnitContentComponent
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
