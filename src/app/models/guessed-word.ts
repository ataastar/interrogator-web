import { Translation } from '@ataastar/interrogator-api-ts-oa/model/translation';

export class GuessedWord {
  translation: Translation;

  lastAnswerWrong = false;
  private wrongAnswerNumber = 0;
  private correctAnswerNumber = 0;

  constructor(word: Translation) {
    this.translation = word;
  }

  public getWrongAnswerNumber(): number {
    return this.wrongAnswerNumber;
  }

  public incrementWrongAnswer(): void {
    this.wrongAnswerNumber++;
    this.lastAnswerWrong = true;
  }

  public incrementCorrectAnswer(): void {
    this.correctAnswerNumber++;
    this.lastAnswerWrong = false;
  }

  getNextInterrogationTimeAsMillis() {
    return this.translation.nextInterrogationTime != null ? new Date(this.translation.nextInterrogationTime).getTime() : null;
  }

  getLastAnswerTimeAsMillis() {
    return this.translation.lastAnswerTime != null ? new Date(this.translation.lastAnswerTime).getTime() : null;
  }
}
