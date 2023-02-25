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
 * Interrogates the words of the unit content. (all the word or just the words which should be interrogated by next interrogation date)
 * Firstly interrogates those words which were interrogated earlier. Creates kind of groups by the last interrogation time and randomly interrogates words from the groups.
 * When the wrong answer reach the number of 5, then won't be interrogated (pick up) new word from the groups, it interrogates the picked up words until the words will be answered right twice in a row
 */
@Component({
  selector: 'interrogator',
  templateUrl: './interrogator.component.html',
  styleUrls: ['./interrogator.component.css'],
})
export class InterrogatorComponent {

  /**
   * It is an array which contain GuessedWords array: e.g. [GuessedWord[]]. The first array of guessed word is interrogated first and later the second, ...
   */
  categorizedWords: Array<Array<GuessedWord>> = null;
  /**
   * Contains the words which should be interrogated before others to be added.
   */
  needToInterrogate: Array<GuessedWord> = [];
  /**
   * The words which will be interrogated randomly. Filled from the needToInterrogate and can be added some more words from the next array from the categorizedWords
   */
  actualWords: GuessedWord[] = [];
  wrongAnswerCount = 0;
  /**
   * Currently answered word list. Contains the last answered words (the last 3 times)
   */
  currentlyAnswered: GuessedWord[] = [];
  /**
   * The current word which, should be guessed
   */
  guessed: GuessedWord = null;
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
    const categorizeWords = this.categorizeWords(new GuessedWordConverter().convertToGuessed(this.wordService.getActualWords()));
    const categorizeWordsLength = categorizeWords != null ? categorizeWords.length : 0; // need to store the length because list is modified later
    this.fillWordArrays();
    if (categorizeWordsLength > 0) {
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
          this.categorizeWords(new GuessedWordConverter().convertToGuessed(words));
          this.fillWordArrays();
          this.next();
        }
      });
    }
  }

  categorizeWords(words: GuessedWord[], filterForExpired: boolean = true): Array<Array<GuessedWord>> {
    if (words == null) {
      return null;
    }
    const now = new Date().getTime();
    //console.log(now);
    if (filterForExpired) {
      words = words.filter(w => {
        //console.log(w.getNextInterrogationTimeAsMillis());
        return w.word.nextInterrogationTime == null || w.getNextInterrogationTimeAsMillis() <= now
      });
    }
    words = words.sort((a, b) => (a.word.lastAnswerTime < b.word.lastAnswerTime ? -1 : 1));
    //console.log(words);
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
    if (actualArray.length > 0) {
      result.push(actualArray);
    }
    //console.log(result);
    this.categorizedWords = result;
    return result;

  }

  /**
   * Fills the needToInterrogate and the actualWords array depends on how many words were answered wrong
   * and how many words are in the next group of the categorizedWords
   */
  fillWordArrays(): boolean {
    if (this.categorizedWords == null || this.categorizedWords.length == 0 || this.wrongAnswerCount >= 5) {
      return false; // no word to add
    }
    let wordCanBeAddedCount = 5 - this.actualWords.length;
    //console.log('wordCanBeAddedCount: ' + wordCanBeAddedCount);
    if (wordCanBeAddedCount <= 0) { // we have enough word to interrogate (the previous group contained many words)
      //console.log('wordCanBeAddedCount <= 0');
      return true;
    }
    let fillAllFirstLevel = this.needToInterrogate.length - this.wrongAnswerCount == 0; // the first group of words were interrogated or this is the first fill
    while (wordCanBeAddedCount > 0 && this.categorizedWords.length > 0) {
      let currentlyAddedWords: GuessedWord[] = [];
      let currentlyAddedCount = 0;
      for (const word of this.categorizedWords[0]) { // get the first group of words and add to the actual words
        //console.log('from categorizedWords: ' + JSON.stringify(word.word));
        if (fillAllFirstLevel) { // in this case we fill all words from the current group
          if (this.addToActualWordIfNotExists(word, currentlyAddedWords)) {
            wordCanBeAddedCount--;
          }
          continue;
        }
        if (this.addToActualWordIfNotExists(word, currentlyAddedWords)) {
          wordCanBeAddedCount--;
        }
        currentlyAddedCount++;
        if (wordCanBeAddedCount <= 0) { // we reached the max number of words
          break;
        }
      }
      // need to remove the first group if:
      // 1. fillAllFirstLevel is true (all was interrogated from the first group or it is the initial fill)
      // 2. or all of the words were added to the actual array from the first group
      if (fillAllFirstLevel || currentlyAddedCount >= this.categorizedWords[0].length) {
        //console.log('need to remove the first array of categorizedWords.');
        this.needToInterrogate = this.needToInterrogate.concat(currentlyAddedWords);
        this.categorizedWords.splice(0, 1);
      }
      fillAllFirstLevel = false;
    }
    return true;
  }

  /**
   * Add the parameter word to the actualWords array if it does not contain the word.
   * @param word
   * @param words
   * @private
   * @return true if the word was added to the actual array (actual array did not contain the word before)
   */
  private addToActualWordIfNotExists(word: GuessedWord, words: GuessedWord[]): boolean {
    // add to the actualWords list
    let found = false;
    for (const wordInList of words) {
      if (wordInList.word.id == word.word.id) {
        found = true;
      }
    }
    if (!found) {
      words.push(word)
    }
    // add to the actualWords list
    found = false;
    for (const wordInList of this.actualWords) {
      if (wordInList.word.id == word.word.id) {
        found = true;
      }
    }
    if (!found) {
      this.actualWords.push(word)
    }
    return !found;
  }

  check(): void {
    if (this.comparator.isEqual(this.guessed.word.to, this.to)) {
      // if this is the last or the previous answer was also right, then remove from the array
      if (!this.guessed.lastAnswerWrong || this.actualWords.length === 1) {
        this.removeWordFromActualArrays(this.guessed);
        if (this.guessed.getWrongAnswerNumber() == 0) { // if the first was right, then send it to the server
          this.wordService.rightAnswer(this.guessed.word.id, InterrogatorType.WRITING);
          //console.log('wrongAnswerCount: ' + this.wrongAnswerCount);
          if (this.wrongAnswerCount < 5) { // no need to add new word to interrogate if we reached the maximum wrong answer count
            this.fillWordArrays();
          }
        }
      }
      this.guessed.incrementCorrectAnswer();
    } else {
      if (this.guessed.getWrongAnswerNumber() == 0) {
        this.wordService.wrongAnswer(this.guessed.word.id, InterrogatorType.WRITING); // TODO handle globally if something go wrong such a call
        this.wrongAnswerCount++;
        //console.log('wrong input for: ' + this.guessed.word.from);
      }
      this.guessed.incrementWrongAnswer();
      this.wrong = true;
      if (this.wrongAnswerCount == 5) { // when the 5 words were answered wrongly, then need to remove other words from the actual list. Need to interrogate just the remaining words which ware answered wrongly
        this.interrogateWordsWithWrongAnswer();
      }
    }
    this.currentlyAnswered.push(this.guessed);
    // need to remove word from currently answered list (the oldest or more)
    this.removeFromCurrentlyAnswered();
    this.checked = true;
    // play the audio if available
    if (this.guessed.word.audio) {
      let player: any = document.getElementById('audioplayer');
      player.play();
    }
  }

  private interrogateWordsWithWrongAnswer() {
    //console.log('interrogateWordsWithWrongAnswer...')
    const wordsWithWrongAnswer: GuessedWord[] = []
    for (const word of this.actualWords) {
      if (word.getWrongAnswerNumber() > 0) {
        wordsWithWrongAnswer.push(word);
        //console.log(word);
      }
    }
    this.actualWords = wordsWithWrongAnswer;
    //console.log('interrogateWordsWithWrongAnswer end')
  }

  private removeFromCurrentlyAnswered() {
    const currentlyAnsweredLengthShouldBe = this.actualWords.length > 4 ? 3 : (this.actualWords.length == 4 ? 2 : (this.actualWords.length <= 1 ? 0 : 1));
    this.currentlyAnswered.splice(0, Math.max(this.currentlyAnswered.length - currentlyAnsweredLengthShouldBe, 0));
  }

  private removeWordFromActualArrays(word: GuessedWord): void {
    let index = this.actualWords.findIndex(x => x.word.id == word.word.id);
    if (index > -1) {
      //console.log(index);
      //console.log(JSON.stringify(word));
      this.actualWords.splice(index, 1);
    } else {
      console.log("Can not find word in the actual array!!!");
      console.log(word);
      console.log(this.actualWords);
    }
    index = this.needToInterrogate.findIndex(x => x.word.id == word.word.id);
    if (index > -1) {
      //console.log(index);
      this.needToInterrogate.splice(index, 1);
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

  /**
   * Randomly choose one word from the difference between <b>actualWords</b> and <b>currentlyAnswered</b> list
   */
  getRandomWord(): GuessedWord {
    if (this.actualWords == null || this.actualWords.length == 0) {
      return null;
    }
    // fill a new list with words which are in the actual list but not in the currently answered list.
    const forRandom: GuessedWord[] = [];
    for (const word of this.actualWords) {
      let found = false;
      for (const answered of this.currentlyAnswered) {
        if (word.word.id === answered.word.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        forRandom.push(word);
      }
    }
    let remainingWordsNumber = forRandom.length;
    // if no more words, then return null
    if (remainingWordsNumber === 0) {
      return null;
    } else if (remainingWordsNumber === 1) {
      return forRandom[0];
    } else {
      return forRandom[this.getRandomIndex(remainingWordsNumber)];
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
