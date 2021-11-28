import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { WordService } from '../services/word-service';
import { GuessedWord } from '../models/guessed-word';

import { switchMap } from 'rxjs/operators';
import { GuessedWordConverter } from './guessed-word-converter';
import { Word } from '../models/word';
import { TextComparator } from './text-comparator';
import { InterrogatorType } from './enum/interrogator-type';


@Component({
  selector: 'interrogator',
  templateUrl: './interrogator.component.html',
  styleUrls: ['./interrogator.component.css'],
})
export class InterrogatorComponent {

  /**
   * The words which are assigned to the unit. These words will be interrogated
   */
  actualWords: GuessedWord[] = null;
  /**
   * The current word which, should be guessed
   */
  word: GuessedWord = null;
  /**
   * Random generated index. The index of the guessed word array.
   */
  index: number = null;
  /**
   * The input word.
   */
  to: string;
  /**
   * The checked logical data. True if user has sent to check the input word
   */
  checked: boolean = false;
  /**
   * Sign that the input word is right
   */
  wrong: boolean = false;
  /**
   * The comparator
   */
  comparator: TextComparator = new TextComparator();
  /**
   * Array which stores the wrong words id. Words which was written incompletely
   */
  wrongWordList: boolean[] = [];

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.wrongWordList = [];
    this.actualWords = new GuessedWordConverter().convertToGuessed(this.wordService.getActualWords());
    if (this.actualWords) {
      this.next();
    } else {
      this.route.paramMap
        .pipe(switchMap((params: ParamMap) => {
          let unitId = params.get('id');
          if (unitId) {
            return this.wordService.getWords(params.get('id'));
          } else {
            return new Promise<Word[]>((resolve) => {
              resolve(null);
            });
          }
        })).subscribe(words => {
        if (words) {
          this.actualWords = new GuessedWordConverter().convertToGuessed(words);
          this.next();
        }
      });
    }
  }

  check(): void {
    if (this.comparator.isEqual(this.word.to, this.to)) {
      // if this is the last or the last answer was not wrong, then remove from the array
      if (!this.word.lastAnswerWrong || this.actualWords.length === 1) {
        this.actualWords.splice(this.index, 1);
      }
      this.word.incrementCorrectAnswer();
    } else {
      this.word.incrementWrongAnswer();
      this.wrong = true;
      if (!this.wrongWordList[this.word.id]) {
        this.wordService.wrongAnswer(this.word.id, InterrogatorType.WRITING); // TODO handle globally if something go wrong such a call
        console.log('wrong input for: ' + this.word.from);
        this.wrongWordList[this.word.id] = true;
      }
    }
    this.checked = true;
    // play the audio if available
    if (this.word.audio) {
      let player: any = document.getElementById('audioplayer');
      player.play();
    }
  }

  next(): void {
    this.word = this.getRandomWord();
    this.checked = false;
    this.wrong = false;
    this.to = null;
    if (this.word != null && document.getElementById('to') != null) {
      document.getElementById('to').focus();
    }
  }

  getRandomWord(): GuessedWord {
    let remainingWordsNumber = this.actualWords != null ? this.actualWords.length : 0;
    // if no more words, then return null
    if (remainingWordsNumber === 0) {
      return null;
    } else {
      let tempIndex: number = this.getRandomIndex(remainingWordsNumber);
      // if this is the last, then no need to get new random number
      if (this.index != null && remainingWordsNumber > 1) {
        while (this.index === tempIndex) {
          tempIndex = this.getRandomIndex(remainingWordsNumber);
        }
      }
      this.index = tempIndex;
      return this.actualWords[this.index];
    }
  }

  getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }

  getImageUrl() {
    return //require('../../assets/images/' + this.word.imageUrl);
  }

  getAudio() {
    return //require('../../assets/audios/' + this.word.audio);
  }

  back(): void {
    this.router.navigate(['']);
  }
}
