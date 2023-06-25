import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WordService } from '../services/word-service';
import { UnitGroup } from '@ataastar/interrogator-api-ts-oa';


@Component({
  selector: 'admin',
  templateUrl: './admin.html',
})
export class AdminComponent {

  public groups: UnitGroup[];

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.wordService.getGroups().subscribe(groups => this.groups = groups);
  }

  interrogate(key: string): void {
    this.router.navigate(['/interrogator', key, 'db']);
  }

}
