import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WordService } from '../services/word-service';


@Component({
  selector: 'admin',
  templateUrl: './admin.html',
})
export class AdminComponent {

  public groups: any;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.wordService.getGroups().then(groups => this.groups = groups);
  }

  interrogate(key: string): void {
    this.router.navigate(['/interrogator', key, 'db']);
  }

}
