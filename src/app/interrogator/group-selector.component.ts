import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WordService } from '../services/word-service';
import { UnitGroup, UnitLeaf } from '@ataastar/interrogator-api-ts-oa';


@Component({
  selector: 'group-selector',
  templateUrl: './group-selector.html',
})
export class GroupSelectorComponent {

  public groups: UnitGroup[];
  public selectedName: string;

  constructor(private wordService: WordService, private router: Router) {
  }

  ngOnInit(): void {
    this.wordService.getGroups().subscribe(groups => this.groups = groups);
  }

  interrogate(group: UnitGroup, subGroup: UnitLeaf): void {
    this.selectedName = group.name + ' - ' + subGroup.name;
    this.router.navigate(['/interrogator/show', subGroup.code]).then();
  }

}
