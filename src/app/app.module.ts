import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/operator/toPromise';

import { AppComponent } from './app.component';

import { WordService } from './services/word-service';

import { InterrogatorModule } from './interrogator/interrogator.module';
import { AdminModule } from './admin/admin.module';

import { CoreModule } from './core/core.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    InterrogatorModule,
    AdminModule,
//    NgbModule.forRoot(),
    CoreModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent],
  providers: [WordService]
})
export class AppModule { }
