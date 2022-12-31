import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GuessedWord } from 'src/app/models/guessed-word';
import { WordService } from 'src/app/services/word-service';
import { GuessedWordConverter } from '../guessed-word-converter';
import {ArrayUtil} from '../../util/array-util';
import { Phrase } from '../../models/phrase';

@Component({
  selector: 'app-show-phrases',
  templateUrl: './show-phrases.component.html',
  styleUrls: ['./show-phrases.component.css']
})
export class ShowPhrasesComponent implements OnInit {

  words: GuessedWord[] = null;
  wordsDisplayed: boolean[];
  key: string;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.key = params.get('id');
    });
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
        return this.wordService.getWords(params.get('id'));
      })).subscribe(words => {
        this.words = new GuessedWordConverter().convertToGuessed(words);
        if (this.words != null) {
          this.wordsDisplayed = new Array(this.words.length);
          for (let index = 0; index < this.wordsDisplayed.length; index++) {
            this.wordsDisplayed[index] = true;
          }
        }
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

  toString(phrases: Phrase[]) { // TODO avoid code duplication
    return phrases.map(phrase => phrase.phrase).join(',');
  }

}
