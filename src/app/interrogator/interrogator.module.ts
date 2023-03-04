import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InterrogatorComponent } from './interrogator.component';
import { GroupSelectorComponent } from './group-selector.component';
import { WordTypesComponent } from './word-type/display/word-types.component';
import { DisplayWordTypeUnitContentComponent } from './word-type/display-word-type-unit-content.component';
import { WordTypeUnitSelectorComponent } from './word-type/word-type-unit-selector.component';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule, ReactiveFormsModule,
    MatMenuModule, MatButtonModule
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
    GroupSelectorComponent
  ]
})
export class InterrogatorModule {
}
