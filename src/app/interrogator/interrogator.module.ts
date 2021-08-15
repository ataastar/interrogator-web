import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { InterrogatorComponent } from './interrogator.component';
import { GroupSelectorComponent } from './group-selector.component';
import { WordTypesComponent } from './word-type/display/word-types.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule
  ],
  declarations: [
    InterrogatorComponent,
    WordTypesComponent,
    GroupSelectorComponent
  ],
  exports: [
    InterrogatorComponent,
    WordTypesComponent,
    GroupSelectorComponent,
    NgbModule
  ],
  entryComponents: [
  ]
})
export class InterrogatorModule {}
