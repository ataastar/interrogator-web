import { Word } from './word';

export class GuessedWord {
  word: Word;

  lastAnswerWrong = false;
  private wrongAnswerNumber = 0;
  private correctAnswerNumber = 0;

  constructor(word: Word) {
    this.word = word;
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
    return this.word.nextInterrogationTime != null ? new Date(this.word.nextInterrogationTime).getTime() : null;
  }

  getLastAnswerTimeAsMillis() {
    return this.word.lastAnswerTime != null ? new Date(this.word.lastAnswerTime).getTime() : null;
  }
}
