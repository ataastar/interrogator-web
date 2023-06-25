import { GuessedWord } from '../models/guessed-word';
import { Translation } from '@ataastar/interrogator-api-ts-oa/model/translation';

export class GuessedWordConverter {

  public convertToGuessed(words: Translation[]): GuessedWord[] {
    if (words == null) {
      return null;
    }
    return words.map(w => new GuessedWord(w));
  }

}
