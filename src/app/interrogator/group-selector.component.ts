import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WordService } from '../services/word-service';


@Component({
    selector: 'group-selector',
    templateUrl: './group-selector.html',
})
export class GroupSelectorComponent {

    public groups: any;

    constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit(): void {
        this.wordService.getGroups().then(groups => this.groups = groups);
    }

    interrogate(key: String): void {
        this.router.navigate(['/interrogator/show', key]);
    }

}
