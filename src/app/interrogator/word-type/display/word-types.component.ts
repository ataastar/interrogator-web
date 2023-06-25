import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WordService } from 'src/app/services/word-service';
import { ResWordTypeTranslation } from '@ataastar/interrogator-api-ts-oa/model/resWordTypeTranslation';
import { ResWordTypeTranslationRowsInner, WordTypeUnit } from '@ataastar/interrogator-api-ts-oa';

@Component({
  selector: 'word-types',
  templateUrl: './word-types.component.html',
  styleUrls: ['./word-types.component.css']
})
export class WordTypesComponent implements OnInit {

  wordTypeContent: ResWordTypeTranslation = null;
  displayedWordTypeLinks: ResWordTypeTranslationRowsInner[] = null;
  displayedWordTypeUnits: WordTypeUnit[] = null;
  forms: string[];

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.wordService.getWordTypeContent(1, 2, 1).subscribe(result => {
      this.wordTypeContent = result;
      this.forms = this.wordTypeContent.forms;
      this.displayedWordTypeLinks = this.wordTypeContent.rows;
      this.displayedWordTypeUnits = this.wordTypeContent.wordTypeUnits;
      this.sort();
    });
  }

  home(): void {
    this.router.navigate(['/interrogator']);
  }

  showTo(link: ResWordTypeTranslationRowsInner, form: string) {
    for (const toPhrase of link.toPhrases) {
      for (const toPhraseKey of Object.keys(toPhrase)) {
        if (form === toPhraseKey) {
          return toPhrase[toPhraseKey].toString();
        }
      }
    }
    return 'nincs';
  }

  private sort() {
    this.displayedWordTypeUnits.sort((a, b) => (a.name > b.name ? 1 : -1));
    this.displayedWordTypeLinks.sort((a, b) => (a.toPhrases.filter((value) => value['Verb'] != null)[0]['Verb'][0] > b.toPhrases.filter((value) => value['Verb'] != null)[0]['Verb'][0]) ? 1 : -1);
  }

  toggleUnit(link: ResWordTypeTranslationRowsInner, unit: WordTypeUnit) {
    if (this.isInUnit(link, unit)) {
      this.wordService.deleteWordTypeUnitLink(link, unit).subscribe(() => {
        this.linkRemoveFromUnit(link, unit);
      });
    } else {
      this.wordService.addWordTypeUnitLink(link, unit).subscribe(() => {
        this.linkAddToUnit(link, unit);
      });
    }
  }

  private linkAddToUnit(link: ResWordTypeTranslationRowsInner, unit: WordTypeUnit) {
    this.linkRemoveFromUnit(link, unit);
    link.wordTypeUnitIds.push(unit.id);
  }


  private linkRemoveFromUnit(link: ResWordTypeTranslationRowsInner, unit: WordTypeUnit) {
    if (link.wordTypeUnitIds == null) {
      link.wordTypeUnitIds = []
    }
    const index = link.wordTypeUnitIds.indexOf(unit.id, 0);
    if (index > -1) {
      link.wordTypeUnitIds.splice(index, 1);
    }
  }

  isInUnit(link: ResWordTypeTranslationRowsInner, unit: WordTypeUnit): boolean {
    return link.wordTypeUnitIds != null && link.wordTypeUnitIds.includes(unit.id);
  }

}
