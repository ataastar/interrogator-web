import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WordTypeLink } from 'src/app/models/word-type/word-type-link';
import { WordService } from 'src/app/services/word-service';

@Component({
  selector: 'display-word-type-unit-content',
  templateUrl: './display-word-type-unit-content.component.html',
  styleUrls: ['./display-word-type-unit-content.component.css']
})
export class DisplayWordTypeUnitContentComponent implements OnInit {

  wordTypeLinks: WordTypeLink[] = null;
  wordsDisplayed: boolean[];
  forms: string[]

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.wordService.getWordTypeUnitContent(1, 2).then(result => {
      this.forms = result.forms
      this.wordTypeLinks = result.links
      this.displayAll()
    })
  }

  home(): void {
    this.router.navigate(['/interrogator']);
  }

  interrogateHere(): void {
    // TODO order
    this.setAllVisible(false)
  }

  display(index: number): void {
    this.wordsDisplayed[index] = true;
  }

  showTo(link: WordTypeLink, form: string): any {
    for (const toPhrase of link.toPhrases) {
      if (form == toPhrase.form) {
        return toPhrase.phrases.toString()
      }
    }
    return "-"
  }

  displayAll(): void {
    if (this.wordTypeLinks != null) {
      this.setAllVisible(true)
    }
  }

  setAllVisible(visible: boolean) {
    this.wordsDisplayed = new Array(this.wordTypeLinks.length);
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = visible;
    }
}

  randomizeLinks() {
    const randomLinks: WordTypeLink[] = []
  }

}
