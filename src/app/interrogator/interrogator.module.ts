import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InterrogatorComponent } from './interrogator.component';
import { GroupSelectorComponent } from './group-selector.component';
import { WordTypesComponent } from './word-type/display/word-types.component';
import { DisplayWordTypeUnitContentComponent } from './word-type/display-word-type-unit-content.component';
import { WordTypeUnitSelectorComponent } from './word-type/word-type-unit-selector.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule, ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    InterrogatorComponent,
    WordTypesComponent,
    DisplayWordTypeUnitContentComponent,
    WordTypeUnitSelectorComponent,
    GroupSelectorComponent
  ],
  exports: [
    InterrogatorComponent,
    WordTypesComponent,
    DisplayWordTypeUnitContentComponent,
    WordTypeUnitSelectorComponent,
    GroupSelectorComponent,
    NgbModule
  ],
  entryComponents: []
})
export class InterrogatorModule {
}
