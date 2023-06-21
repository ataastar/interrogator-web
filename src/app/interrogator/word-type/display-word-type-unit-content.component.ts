import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WordService } from 'src/app/services/word-service';
import { ArrayUtil } from '../../util/array-util';
import { ResWordTypeUnitTranslation, WordTypeTranslation } from '@ataastar/interrogator-api-ts-oa';
import { of } from 'rxjs';

@Component({
  selector: 'display-word-type-unit-content',
  templateUrl: './display-word-type-unit-content.component.html',
  styleUrls: ['./display-word-type-unit-content.component.css']
})
export class DisplayWordTypeUnitContentComponent implements OnInit {

  wordTypeLinks: WordTypeTranslation[] = null;
  wordsDisplayed: boolean[];
  forms: string[];

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const unitId = params.get('id');
      if (unitId) {
        return this.wordService.getWordTypeUnitContent(Number(unitId), 2).subscribe(result => {
          if (result) {
            this.forms = result.forms;
            this.wordTypeLinks = result.rows;
            this.sort();
            this.displayAll();
          }
        });
      } else {
        return of<ResWordTypeUnitTranslation>(null);
      }
    });
  }

  home(): void {
    this.router.navigate(['/interrogator']);
  }

  interrogateHere(): void {
    ArrayUtil.shuffle(this.wordTypeLinks);
    this.setAllVisible(false);
  }

  display(index: number): void {
    this.wordsDisplayed[index] = true;
  }

  showTo(link: WordTypeTranslation, form: string) {
    for (const toPhrase of link.toPhrases) {
      for (const toPhraseKey of Object.keys(toPhrase)) {
        if (form === toPhraseKey) {
          return toPhrase[toPhraseKey].toString();
        }
      }
    }
    return '-';
  }

  displayAll(): void {
    if (this.wordTypeLinks != null) {
      this.setAllVisible(true);
    }
  }

  private setAllVisible(visible: boolean) {
    this.wordsDisplayed = new Array(this.wordTypeLinks.length);
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = visible;
    }
  }

  private sort() {
    this.wordTypeLinks.sort((a, b) => (a.toPhrases.filter((value) => value['Verb'] != null)[0]
      > b.toPhrases.filter((value) => value['Verb'] != null)[0]) ? -1 : 1);
  }

}
