import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WordService } from 'src/app/services/word-service';

@Component({
  selector: 'word-type-unit-selector',
  templateUrl: './word-type-unit-selector.html',
})
export class WordTypeUnitSelectorComponent {

  public units: any;
  public selectedName: string;

  constructor(private wordService: WordService, private router: Router) {
  }

  ngOnInit(): void {
    this.wordService.getWordTypeUnits().then(units => this.units = units);
  }

  interrogate(unit: any): void {
    this.selectedName = unit.name;
    this.router.navigate(['/wordTypeUnit/', unit.code]);
  }

}
