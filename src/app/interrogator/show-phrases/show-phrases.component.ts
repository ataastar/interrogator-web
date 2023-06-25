import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GuessedWord } from 'src/app/models/guessed-word';
import { WordService } from 'src/app/services/word-service';
import { GuessedWordConverter } from '../guessed-word-converter';
import { ArrayUtil } from '../../util/array-util';
import { TranslationPart } from '@ataastar/interrogator-api-ts-oa';

@Component({
  selector: 'app-show-phrases',
  templateUrl: './show-phrases.component.html',
  styleUrls: ['./show-phrases.component.css']
})
export class ShowPhrasesComponent implements OnInit {

  words: GuessedWord[] = null;
  wordsDisplayed: boolean[];
  key: string;
  fromLanguageId: number;
  toLanguageId: number;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.fromLanguageId = this.wordService.fromLanguageId;
    this.toLanguageId = this.wordService.toLanguageId
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.key = params.get('id');
      return this.wordService.getWords(this.key).subscribe(translations => {
        this.words = new GuessedWordConverter().convertToGuessed(translations.translations);
        if (this.words != null) {
          this.wordsDisplayed = new Array(this.words.length);
          for (let index = 0; index < this.wordsDisplayed.length; index++) {
            this.wordsDisplayed[index] = true;
          }
        }
      });
    });
  }

  interrogate(): void {
    this.router.navigate(['/interrogator', this.key]);
  }

  interrogateHere(): void {
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = false;
    }
    ArrayUtil.shuffle(this.words);
  }

  display(i: number): void {
    this.wordsDisplayed[i] = true;
  }

  addNew(): void {
    this.router.navigate(['/admin/addUnitContent', this.key]);
  }

  toString(translationParts: TranslationPart[]) { // TODO avoid code duplication
    return translationParts.map(translationParts => translationParts.phrase).join(',');
  }

}
