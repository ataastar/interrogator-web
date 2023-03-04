export class Phrase {
  translationId?: number;
  phrase: string;

  constructor(phrase: string, translationId?: number) {
    this.phrase = phrase;
    this.translationId = translationId;
  }

}
