import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { WordService } from './services/word-service';

import { InterrogatorModule } from './interrogator/interrogator.module';
import { AdminModule } from './admin/admin.module';

import { CoreModule } from './core/core.module';
import { ShowPhrasesComponent } from './interrogator/show-phrases/show-phrases.component';
import { AddUnitContentComponent } from './admin/add-unit-content/add-unit-content.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
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
  providers: [WordService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }]
})
export class AppModule { }
