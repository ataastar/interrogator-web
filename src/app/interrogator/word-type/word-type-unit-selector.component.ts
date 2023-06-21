import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WordService } from 'src/app/services/word-service';
import { UnitLeaf } from '@ataastar/interrogator-api-ts-oa/model/unitLeaf';

@Component({
  selector: 'word-type-unit-selector',
  templateUrl: './word-type-unit-selector.html',
})
export class WordTypeUnitSelectorComponent {

  public units: UnitLeaf[];
  public selectedName: string;

  constructor(private wordService: WordService, private router: Router) {
  }

  ngOnInit(): void {
    this.wordService.getWordTypeUnits().subscribe(units => this.units = units);
  }

  interrogate(unit): void {
    this.selectedName = unit.name;
    this.router.navigate(['/wordTypeUnit/', unit.code]);
  }

}
