import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'group-selector-json',
    templateUrl: './group-selector-json.component.html',
})
export class GroupSelectorJsonComponent {

    constructor(private router: Router) { }

    interrogate(key: string): void {
        this.router.navigate(['/interrogator', key]);
    }
}
