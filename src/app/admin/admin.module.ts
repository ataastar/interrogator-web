import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    declarations: [
        AdminComponent
    ],
    exports: [
      AdminComponent
    ]
})
export class AdminModule {}
