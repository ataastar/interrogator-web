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
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { AuthGuard } from './core/auth/auth-guard';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    InterrogatorModule,
    AdminModule,
    CoreModule, MatButtonModule
  ],
  declarations: [
    AppComponent,
    ShowPhrasesComponent,
    AddUnitContentComponent
  ],
  bootstrap: [AppComponent],
  providers: [WordService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }]
})
export class AppModule { }
