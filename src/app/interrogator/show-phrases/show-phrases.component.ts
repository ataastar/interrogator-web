import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GuessedWord } from 'src/app/models/guessed-word';
import { WordService } from 'src/app/services/word-service';
import { GuessedWordConverter } from '../guessed-word-converter';
import { ArrayUtil } from '../../util/array-util';
import { ReqAddAnswer } from '@ataastar/interrogator-api-ts-oa';
import { Translation } from '@ataastar/interrogator-api-ts-oa/model/translation';
import InterrogationTypeEnum = ReqAddAnswer.InterrogationTypeEnum;

@Component({
  selector: 'app-show-phrases',
  templateUrl: './show-phrases.component.html',
  styleUrls: ['./show-phrases.component.css']
})
export class ShowPhrasesComponent implements OnInit {

  words: GuessedWord[] = null;
  answerTypes: AnswerType[] = null;
  wordsDisplayed: boolean[];
  key: string;
  fromLanguageId: number;
  toLanguageId: number;
  lastAnswerWasType: AnswerType = null;
  lastAnswerWordIndex: number;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.fromLanguageId = this.wordService.fromLanguageId;
    this.toLanguageId = this.wordService.toLanguageId
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.key = params.get('id');
      return this.wordService.getWords(this.key).subscribe(translations => {
        this.wordService.setTranslations(translations);
        this.lastAnswerWordIndex = null;
        this.lastAnswerWasType = null;
        this.words = new GuessedWordConverter().convertToGuessed(translations.translations);
        if (this.words != null) {
          this.wordsDisplayed = new Array(this.words.length);
          this.answerTypes = new Array(this.words.length);
          for (let index = 0; index < this.wordsDisplayed.length; index++) {
            this.wordsDisplayed[index] = true;
            this.answerTypes[index] = null;
          }
        }
      });
    });
  }

  interrogate(): void {
    this.router.navigate(['/interrogator', this.key]);
  }

  interrogateHere(): void {
    this.lastAnswerWordIndex = null;
    this.lastAnswerWasType = null;
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = false;
      this.answerTypes[index] = null;
    }
    ArrayUtil.shuffle(this.words);
  }

  display(i: number): void {
    this.wordsDisplayed[i] = true;
  }

  answer(i: number, rightAnswer: boolean): void {
    this.lastAnswerWasType = null;
    this.lastAnswerWordIndex = i;
    this.wordsDisplayed[i] = true;
    this.words[i].translation.lastAnswerRight = rightAnswer;
    this.wordService.sendAnswer(this.words[i].translation.unitContentId, rightAnswer, InterrogationTypeEnum.SelfDeclaration, this.fromLanguageId)
      .subscribe(() => {
        this.lastAnswerWasType = rightAnswer ? AnswerTypeEnum.RIGHT : AnswerTypeEnum.FALSE;
        this.answerTypes[i] = this.lastAnswerWasType;
      })
  }

  skip(i: number): void {
    this.lastAnswerWasType = AnswerTypeEnum.SKIP;
    this.answerTypes[i] = this.lastAnswerWasType;
    this.lastAnswerWordIndex = i;
    this.wordsDisplayed[i] = true;
  }

  cancelLast(i: number, lastAnswerWasRight: boolean): void {
    this.wordService.cancelAnswer(this.words[i].translation.unitContentId, lastAnswerWasRight, InterrogationTypeEnum.SelfDeclaration, this.fromLanguageId)
      .subscribe(() => {
        this.lastAnswerWasType = null;
        this.lastAnswerWordIndex = null;
        this.answerTypes[i] = lastAnswerWasRight ? AnswerTypeEnum.FALSE : AnswerTypeEnum.SKIP;
      })
  }

  addNew(): void {
    this.router.navigate(['/admin/addUnitContent', this.key]);
  }

  toString(translation: Translation, languageId: number) {
    return translation.phrasesByLanguageId[languageId].map(translationParts => translationParts.phrase).join(',');
  }

  theAnswerWasRight(index: number): boolean {
    if (this.answerTypes == null) {
      return false;
    }
    return AnswerTypeEnum.RIGHT == this.answerTypes[index];
  }

  theAnswerWasFalse(index: number): boolean {
    if (this.answerTypes == null) {
      return false;
    }
    return AnswerTypeEnum.FALSE == this.answerTypes[index];
  }

  theAnswerWasSkip(index: number): boolean {
    if (this.answerTypes == null) {
      return false;
    }
    return AnswerTypeEnum.SKIP == this.answerTypes[index];
  }

  getPhraseColor(translation: Translation) {
    if (translation.lastAnswerRight != null && !translation.lastAnswerRight) {
      return 'text-danger';
    }
    if (translation.nextInterrogationTime == null) {
      return '';
    }
    return this.needToInterrogate(translation) ? 'text-info' : 'text-success';
  }

  needToInterrogate(translation: Translation): boolean {
    return translation.nextInterrogationTime == null || new Date(translation.nextInterrogationTime).getTime() <= new Date().getTime();
  }

  showYetDoNotKnow(i: number): boolean {
    return i == this.lastAnswerWordIndex
      && (this.lastAnswerWasType == AnswerTypeEnum.RIGHT || this.lastAnswerWasType == AnswerTypeEnum.SKIP && !this.needToInterrogate(this.words[i].translation));
  }

  showYetKnow(i: number): boolean {
    return i == this.lastAnswerWordIndex && this.lastAnswerWasType != null && this.lastAnswerWasType == AnswerTypeEnum.FALSE;
  }
}

export type AnswerType = 'RIGHT' | 'FALSE' | 'SKIP';

export enum AnswerTypeEnum {
  RIGHT = 'RIGHT', FALSE = 'FALSE', SKIP = 'SKIP'
}
