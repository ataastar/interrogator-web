export class Phrase {
    translationId?: Number;
    phrase: String;

    constructor(phrase: String, translationId?: Number) {
        this.phrase = phrase;
        this.translationId = translationId;
    }

}
