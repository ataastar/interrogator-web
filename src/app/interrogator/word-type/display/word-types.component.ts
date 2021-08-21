import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WordTypeContent } from 'src/app/models/word-type/word-type-content';
import { WordTypeLink } from 'src/app/models/word-type/word-type-link';
import { WordService } from 'src/app/services/word-service';

@Component({
  selector: 'word_types',
  templateUrl: './word-types.component.html',
  styleUrls: ['./word-types.component.css']
})
export class WordTypesComponent implements OnInit {

  wordTypeContent: WordTypeContent = null
  allWordTypeContent: WordTypeContent = null
  displayedWordTypeLinks: WordTypeLink[] = null;
  wordsDisplayed: boolean[];
  forms: string[]

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.wordService.getWordTypeContent(1, 2, 1).then(result => {
      this.wordTypeContent = result
      this.forms = this.wordTypeContent.forms
      this.displayActivated()
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
    let toPhrasesString: string

    for (const toPhrase of link.toPhrases) {
      if (form == toPhrase.form) {
        return toPhrase.phrases.toString()
      }
    }

    return "nincs"
  }

  displayActivated(): void {
    this.displayedWordTypeLinks = this.wordTypeContent.links
    if (this.displayedWordTypeLinks != null) {
      this.setAllVisible(true)
    }
  }

  displayAll(): void {
    if (this.allWordTypeContent == null) {
      this.wordService.getWordTypeContent(1, 2, 1).then(result => {
        this.allWordTypeContent = result
        this.displayedWordTypeLinks = this.allWordTypeContent.links
        this.setAllVisible(true)
      })
    } else {
      this.displayedWordTypeLinks = this.allWordTypeContent.links
      this.setAllVisible(true)
    }
  }

  setAllVisible(visible: boolean) {
    this.wordsDisplayed = new Array(this.displayedWordTypeLinks.length);
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = visible;
    }
}

  randomizeLinks() {
    const randomLinks: WordTypeLink[] = []
  }

}
