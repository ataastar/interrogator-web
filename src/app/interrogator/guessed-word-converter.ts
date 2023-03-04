import { GuessedWord } from '../models/guessed-word';
import { Word } from '../models/word';

export class GuessedWordConverter {

  public convertToGuessed(words: Word[]): GuessedWord[] {
    if (words == null) {
      return null;
    }
    return words.map(w => new GuessedWord(w));
  }

}
