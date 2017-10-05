import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { InterrogatorComponent } from './interrogator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
  ],
  declarations: [
    InterrogatorComponent
  ],
  exports: [
    InterrogatorComponent
  ],
  entryComponents: [
  ]
})
export class InterrogatorModule {}
