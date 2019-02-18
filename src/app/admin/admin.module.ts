
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule
  ],
  declarations: [
    AdminComponent
  ],
  exports: [
    AdminComponent,
    NgbModule
  ],
  entryComponents: [
  ]
})
export class AdminModule {}
