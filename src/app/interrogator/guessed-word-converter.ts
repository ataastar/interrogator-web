import { GuessedWord } from '../models/guessed-word';
import { Word } from '../models/word';

export class GuessedWordConverter {

    constructor() { }

    public convertToGuessed(words: Word[]): GuessedWord[] {
        if (words == null) { return null; }
        let actualWords = new Array(words.length);
        let i = 0;
        for (let word of words) {
            actualWords[i] = this.clone(word);
            i++;
        }
        return actualWords;
    }

    private clone(source: Word): GuessedWord {
        let cloned = new GuessedWord();
        // tslint:disable-next-line:forin
        for (let prop in source) {
            cloned[prop] = source[prop];
        }
        // convert the from and to arrays to string
        cloned.from = "";
        for (const phrase of source.from) {
            cloned.from = cloned.from + ";" + phrase.phrase;
        }
        cloned.from = cloned.from.substr(1);
        cloned.to = new Array(source.to.length);
        let i = 0;
        for (const phrase of source.to) {
            cloned.to[i] = phrase.phrase;
            i++;
        }
        return cloned;
    }
}