import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WordTypeContent } from 'src/app/models/word-type/word-type-content';
import { WordTypeLink } from 'src/app/models/word-type/word-type-link';
import { WordTypeUnit } from 'src/app/models/word-type/word-type-unit';
import { WordService } from 'src/app/services/word-service';

@Component({
  selector: 'word-types',
  templateUrl: './word-types.component.html',
  styleUrls: ['./word-types.component.css']
})
export class WordTypesComponent implements OnInit {

  wordTypeContent: WordTypeContent = null;
  displayedWordTypeLinks: WordTypeLink[] = null;
  displayedWordTypeUnits: WordTypeUnit[] = null;
  forms: string[];

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.wordService.getWordTypeContent(1, 2, 1).then(result => {
      this.wordTypeContent = result;
      this.forms = this.wordTypeContent.forms;
      this.displayedWordTypeLinks = this.wordTypeContent.links;
      this.displayedWordTypeUnits = this.wordTypeContent.wordTypeUnits;
      this.sort();
    });
  }

  home(): void {
    this.router.navigate(['/interrogator']);
  }

  showTo(link: WordTypeLink, form: string) {
    for (const toPhrase of link.toPhrases) {
      if (form === toPhrase.form) {
        return toPhrase.phrases.toString();
      }
    }
    return 'nincs';
  }

  private sort() {
    this.displayedWordTypeLinks.sort((a, b) => (a.toPhrases.filter(p => p.form === 'Verb')[0].phrases[0]
      > b.toPhrases.filter(p => p.form === 'Verb')[0].phrases[0]) ? 1 : -1);
  }

  toggleUnit(link: WordTypeLink, unit: WordTypeUnit) {
    if (this.isInUnit(link, unit)) {
      this.wordService.deleteWordTypeUnitLink(link, unit).then(() => {
        this.linkRemoveFromUnit(link, unit);
      });
    } else {
      this.wordService.addWordTypeUnitLink(link, unit).then(() => {
        this.linkAddToUnit(link, unit);
      });
    }
  }

  private linkAddToUnit(link: WordTypeLink, unit: WordTypeUnit) {
    this.linkRemoveFromUnit(link, unit);
    link.wordTypeUnitIds.push(unit.id);
  }


  private linkRemoveFromUnit(link: WordTypeLink, unit: WordTypeUnit) {
    const index = link.wordTypeUnitIds.indexOf(unit.id, 0);
    if (index > -1) {
      link.wordTypeUnitIds.splice(index, 1);
    }
  }

  isInUnit(link: WordTypeLink, unit: WordTypeUnit): boolean {
    return link.wordTypeUnitIds.includes(unit.id);
  }

}
