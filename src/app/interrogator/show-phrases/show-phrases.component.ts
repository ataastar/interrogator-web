import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GuessedWord } from 'src/app/models/guessed-word';
import { WordService } from 'src/app/services/word-service';
import { GuessedWordConverter } from '../guessed-word-converter';
import { ArrayUtil } from '../../util/array-util';
import { ReqAddAnswer, TranslationPart } from '@ataastar/interrogator-api-ts-oa';
import InterrogationTypeEnum = ReqAddAnswer.InterrogationTypeEnum;

@Component({
  selector: 'app-show-phrases',
  templateUrl: './show-phrases.component.html',
  styleUrls: ['./show-phrases.component.css']
})
export class ShowPhrasesComponent implements OnInit {

  words: GuessedWord[] = null;
  answerWasRight: Boolean[] = null;
  wordsDisplayed: boolean[];
  key: string;
  fromLanguageId: number;
  toLanguageId: number;
  lastAnswerWasRight: Boolean = null;
  lastAnswerWordIndex: number;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.fromLanguageId = this.wordService.fromLanguageId;
    this.toLanguageId = this.wordService.toLanguageId
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.key = params.get('id');
      return this.wordService.getWords(this.key).subscribe(translations => {
        this.lastAnswerWordIndex = null;
        this.lastAnswerWasRight = null;
        this.words = new GuessedWordConverter().convertToGuessed(translations.translations);
        if (this.words != null) {
          this.wordsDisplayed = new Array(this.words.length);
          this.answerWasRight = new Array(this.words.length);
          for (let index = 0; index < this.wordsDisplayed.length; index++) {
            this.wordsDisplayed[index] = true;
            this.answerWasRight[index] = null;
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
    this.lastAnswerWasRight = null;
    for (let index = 0; index < this.wordsDisplayed.length; index++) {
      this.wordsDisplayed[index] = false;
      this.answerWasRight[index] = null;
    }
    ArrayUtil.shuffle(this.words);
  }

  display(i: number): void {
    this.wordsDisplayed[i] = true;
  }

  answer(i: number, rightAnswer: boolean): void {
    this.lastAnswerWasRight = null;
    this.lastAnswerWordIndex = i;
    this.wordsDisplayed[i] = true;
    this.wordService.sendAnswer(this.words[i].translation.unitContentId, rightAnswer, InterrogationTypeEnum.SelfDeclaration, this.fromLanguageId)
      .subscribe(res => {
        this.lastAnswerWasRight = Boolean(rightAnswer);
        this.answerWasRight[i] = rightAnswer;
      })
  }

  cancelLast(i: number, lastAnswerWasRight: boolean): void {
    this.wordService.cancelAnswer(this.words[i].translation.unitContentId, lastAnswerWasRight, InterrogationTypeEnum.SelfDeclaration, this.fromLanguageId)
      .subscribe(res => {
        this.lastAnswerWasRight = null;
        this.lastAnswerWordIndex = null;
        this.answerWasRight[i] = lastAnswerWasRight ? false : null;
      })
  }

  addNew(): void {
    this.router.navigate(['/admin/addUnitContent', this.key]);
  }

  toString(translationParts: TranslationPart[]) { // TODO avoid code duplication
    return translationParts.map(translationParts => translationParts.phrase).join(',');
  }

  theAnswerWasRight(index: number): boolean {
    if (this.answerWasRight == null) {
      return false;
    }
    const answerWasRight = this.answerWasRight[index];
    return answerWasRight != null && answerWasRight.valueOf();
  }

  theAnswerWasFalse(index: number): boolean {
    if (this.answerWasRight == null) {
      return false;
    }
    const answerWasRight = this.answerWasRight[index];
    return answerWasRight != null && !answerWasRight.valueOf();
  }
}
