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

/**
 * Interrogates the words of the unit content. (all of the word or just the words which should be interrogate by next interrogation date)
 * Firstly interrogates those words which were interrogated earlier. Creates kind of groups by the last interrogation time and randomly interrogates words from the groups.
 * When the wrong answer reach the number of 5, then won't be interrogate (pick up) new word from the groups, it interrogates the picked up words until the words will be answered right twice in a row
 */
@Component({
  selector: 'interrogator',
  templateUrl: './interrogator.component.html',
  styleUrls: ['./interrogator.component.css'],
})
export class InterrogatorComponent {

  /**
   * It is an array which contain GuessedWords array: e.g. [GuessedWord[]]. The first array of guessed word to be interrogate first and later the second, ...
   */
  categorizedWords: Array<Array<GuessedWord>> = null;
  /**
   * Contains the words which should be interrogate currently the others. It is the part of the categorizedWords
   */
  currentWordArray: Array<GuessedWord> = null;
  /**
   * The words which will be interrogated randomly. Filled from the currentWordArray and can be added some more words from the next array from the categorizedWords
   */
  actualWords: GuessedWord[] = null;
  wrongAnswerCount = 0;
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
      this.categorizeWords(this.actualWords);
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
          this.categorizeWords(this.actualWords);
          this.next();
        }
      });
    }
  }

  categorizeWords(words: GuessedWord[], filterForExpired: boolean = true): Array<Array<GuessedWord>> {
    const now = new Date().getTime();
    console.log(now);
    if (filterForExpired) {
      words = words.filter(w => {
        console.log(w.getNextInterrogationTimeAsMillis());
        return w.word.nextInterrogationTime == null || w.getNextInterrogationTimeAsMillis() <= now
      });
    }
    words = words.sort((a, b) => (a.word.lastAnswerTime < b.word.lastAnswerTime ? -1 : 1));
    console.log(words);
    let firstAnswerTimeDiff: number = null;
    const result: Array<Array<GuessedWord>> = new Array<Array<GuessedWord>>();
    let actualArray: Array<GuessedWord> = new Array<GuessedWord>();
    for (const word of words) {
      if (firstAnswerTimeDiff == null && word.word.lastAnswerTime != null) {
        firstAnswerTimeDiff = now - word.getLastAnswerTimeAsMillis();
      }
      if (firstAnswerTimeDiff == null && word.word.lastAnswerTime != null || firstAnswerTimeDiff / 3 > now - word.getLastAnswerTimeAsMillis()) {
        result.push(actualArray);
        actualArray = [];
        firstAnswerTimeDiff = now - word.getLastAnswerTimeAsMillis();
      }
      actualArray.push(word);
    }
    result.push(actualArray);
    console.log(result);
    this.categorizedWords = result;
    return result;
  }

  private fillWordArrays(): boolean {
    if (this.categorizedWords.length == 0) {return false;} // no any word to add
    let wordCanBeAddedCount = this.wrongAnswerCount - this.actualWords.length;
    if (wordCanBeAddedCount <= 0) {return true;} // we have enough word to interrogate (the previous group contained many words)
    const fillAllFirstLevel = this.currentWordArray.length == 0; // the first group of words are interrogated or this is the first fill
    for (const word of this.categorizedWords[0]) { // get the first group of words and add to the actual words
      if (fillAllFirstLevel) { // in this case we fill all words from the current group
        this.currentWordArray.push(word);
        wordCanBeAddedCount--;
        this.actualWords.push(word)
        continue;
      }
      // TODO add if not exists
      // TODO increment just if was added
      wordCanBeAddedCount--;
      this.actualWords.push(word)
      if (wordCanBeAddedCount <= 0) { // we reached the max number of words
        break;
      }
    }
    // need to remove the first group
    // 1. if fillAllFirstLevel is true (all was interrogated from the first group or it is the initial fill)
    // 2. or if all of the words were added to the actual array from the first group
    if (fillAllFirstLevel || this.actualWords.length - this.currentWordArray.length >= this.categorizedWords[0].length) {
      this.categorizedWords.splice(0, 1);
    }
    while (wordCanBeAddedCount > 0 && this.categorizedWords.length > 0) {
      for (const word of this.categorizedWords[0]) { // get the first group of words and add to the actual words
        // TODO add if not exists
        // TODO increment just if was added
        wordCanBeAddedCount--;
        this.actualWords.push(word)
        if (wordCanBeAddedCount <= 0) { // we reached the max number of words
          break;
        }
      }
      /// need to remove the group if all of the words were added to the actual array from this group
      if (this.actualWords.length - this.currentWordArray.length >= this.categorizedWords[0].length) {
        this.categorizedWords.splice(0, 1);
      }
    }
    // TODO count wrong answer. if the 5 is reached, must not pick up new word to interrogate
    return true; // TODO false if no word to add
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
        this.wrongAnswerCount++;
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
