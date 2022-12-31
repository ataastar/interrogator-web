import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { WordService } from '../services/word-service';
import { GuessedWord } from '../models/guessed-word';

import { switchMap } from 'rxjs/operators';
import { GuessedWordConverter } from './guessed-word-converter';
import { Word } from '../models/word';
import { TextComparator } from './text-comparator';
import { InterrogatorType } from './enum/interrogator-type';
import { Phrase } from '../models/phrase';


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
  guessed: GuessedWord = null;
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

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
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
    if (this.comparator.isEqual(this.guessed.word.to, this.to)) {
      // if this is the last or the previous answer was also right, then remove from the array
      if (!this.guessed.lastAnswerWrong || this.actualWords.length === 1) {
        if (this.guessed.getWrongAnswerNumber() == 0) { // if the first was right, then send it to the server
          this.wordService.rightAnswer(this.guessed.word.id, InterrogatorType.WRITING);
        }
        this.actualWords.splice(this.index, 1);
      }
      this.guessed.incrementCorrectAnswer();
    } else {
      if (this.guessed.getWrongAnswerNumber() == 0) {
        this.wordService.wrongAnswer(this.guessed.word.id, InterrogatorType.WRITING); // TODO handle globally if something go wrong such a call
        console.log('wrong input for: ' + this.guessed.word.from);
      }
      this.guessed.incrementWrongAnswer();
      this.wrong = true;
    }
    this.checked = true;
    // play the audio if available
    if (this.guessed.word.audio) {
      let player: any = document.getElementById('audioplayer');
      player.play();
    }
  }

  next(): void {
    this.guessed = this.getRandomWord();
    this.checked = false;
    this.wrong = false;
    this.to = null;
    if (this.guessed != null && document.getElementById('to') != null) {
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

  toString(phrases: Phrase[]) {
    return phrases.map(phrase => phrase.phrase).join(',');
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
