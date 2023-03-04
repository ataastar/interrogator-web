
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgbModule
    ],
    declarations: [
        AdminComponent
    ],
    exports: [
        AdminComponent,
        NgbModule
    ]
})
export class AdminModule {}
