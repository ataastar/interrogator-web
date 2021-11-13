import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { WordService } from './services/word-service';

import { InterrogatorModule } from './interrogator/interrogator.module';
import { AdminModule } from './admin/admin.module';

import { CoreModule } from './core/core.module';
import { ShowPhrasesComponent } from './interrogator/show-phrases/show-phrases.component';
import { AddUnitContentComponent } from './admin/add-unit-content/add-unit-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowPhrasesComponent,
    AddUnitContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InterrogatorModule,
    AdminModule,
    CoreModule
  ],
  providers: [WordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
