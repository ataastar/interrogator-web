import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WordTypeContent } from 'src/app/models/word-type/word-type-content';
import { WordTypeLink } from 'src/app/models/word-type/word-type-link';
import { WordTypeUnit } from 'src/app/models/word-type/word-type-unit';
import { WordService } from 'src/app/services/word-service';

@Component({
  selector: 'word_types',
  templateUrl: './word-types.component.html',
  styleUrls: ['./word-types.component.css']
})
export class WordTypesComponent implements OnInit {

  wordTypeContent: WordTypeContent = null
  displayedWordTypeLinks: WordTypeLink[] = null;
  displayedWordTypeUnits: WordTypeUnit[] = null;
  wordsDisplayed: boolean[];
  forms: string[]

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.wordService.getWordTypeContent(1, 2, 1).then(result => {
      this.wordTypeContent = result
      this.forms = this.wordTypeContent.forms
      this.displayAll()
    })
  }

  home(): void {
    this.router.navigate(['/interrogator']);
  }

  interrogateHere(): void {
    // TODO order
    this.displayedWordTypeLinks = this.wordTypeContent.links
    this.setAllVisible(false)
  }

  visible(index: number): void {
    this.wordsDisplayed[index] = true;
  }

  showTo(link: WordTypeLink, form: string): any {
    for (const toPhrase of link.toPhrases) {
      if (form == toPhrase.form) {
        return toPhrase.phrases.toString()
      }
    }

    return "nincs"
  }

  displayAll(): void {
    this.displayedWordTypeLinks = this.wordTypeContent.links
    if (this.displayedWordTypeLinks != null) {
      this.setAllVisible(true)
    }
    this.displayedWordTypeUnits = this.wordTypeContent.wordTypeUnits
  }

  setAllVisible(visible: boolean) {
    this.wordsDisplayed = new Array(this.displayedWordTypeLinks.length);
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = visible;
    }
  }

  toggleUnit(link: WordTypeLink, unit: WordTypeUnit) {
    if (this.isInUnit(link, unit)) {
      this.wordService.deleteWordTypeUnitLink(link, unit).then(result => { this.linkRemoveFromUnit(link, unit) })
    } else {
      this.wordService.addWordTypeUnitLink(link, unit).then(result => { this.linkAddToUnit(link, unit) })
    }
  }

  linkAddToUnit(link: WordTypeLink, unit: WordTypeUnit) {
    this.linkRemoveFromUnit(link, unit)
    link.wordTypeUnits.push(unit.id)
  }


  linkRemoveFromUnit(link: WordTypeLink, unit: WordTypeUnit) {
    const index = link.wordTypeUnits.indexOf(unit.id, 0);
    if (index > -1) {
      link.wordTypeUnits.splice(index, 1);
    }
  }

  randomizeLinks() {
    const randomLinks: WordTypeLink[] = []
  }

  isInUnit(link: WordTypeLink, unit: WordTypeUnit): boolean {
    return link.wordTypeUnits.includes(unit.id)
  }

}
