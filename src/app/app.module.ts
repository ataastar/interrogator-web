import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { WordService } from './services/word-service';

import { InterrogatorModule } from './interrogator/interrogator.module';
import { AdminModule } from './admin/admin.module';

import { CoreModule } from './core/core.module';
import { ShowPhrasesComponent } from './interrogator/show-phrases/show-phrases.component';
import { AddUnitContentComponent } from './admin/add-unit-content/add-unit-content.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    InterrogatorModule,
    AdminModule,
    CoreModule
  ],
  declarations: [
    AppComponent,
    ShowPhrasesComponent,
    AddUnitContentComponent
  ],
  bootstrap: [AppComponent],
  providers: [WordService]
})
export class AppModule { }
