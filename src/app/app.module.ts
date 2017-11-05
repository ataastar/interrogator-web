import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/operator/toPromise';

import { AppComponent } from './app.component';

import { WordService } from './services/word-service';

import { InterrogatorModule } from './interrogator/interrogator.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { routing } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    InterrogatorModule,
    NgbModule.forRoot(),
    routing
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent],
  providers: [WordService]
})
export class AppModule { }
