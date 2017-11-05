import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { InterrogatorComponent } from './interrogator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule
  ],
  declarations: [
    InterrogatorComponent
  ],
  exports: [
    InterrogatorComponent,
    NgbModule
  ],
  entryComponents: [
  ]
})
export class InterrogatorModule {}
