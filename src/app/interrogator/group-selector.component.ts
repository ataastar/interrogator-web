import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WordService } from '../services/word-service';


@Component({
  selector: 'group-selector',
  templateUrl: './group-selector.html',
})
export class GroupSelectorComponent {

  public groups: any;
  public selectedName: string;

  constructor(private wordService: WordService, private router: Router) {
  }

  ngOnInit(): void {
    this.wordService.getGroups().then(groups => this.groups = groups);
  }

  interrogate(group: any, subGroup: any): void {
    this.selectedName = group.name + ' - ' + subGroup.name;
    this.router.navigate(['/interrogator/show', subGroup.code]);
  }

}
