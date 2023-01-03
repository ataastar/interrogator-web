import { InterrogatorComponent } from './interrogator.component';
import { WordService } from '../services/word-service';
import { GuessedWord } from '../models/guessed-word';
import { Word } from '../models/word';

function setup(): InterrogatorComponent {
  const wordServiceSpy =
    jasmine.createSpyObj('WordService', ['getActualWords']);
  const stubValue = [];
  const component = new InterrogatorComponent(wordServiceSpy, null, null);

  wordServiceSpy.getActualWords.and.returnValue(stubValue);
  return component;
}

describe('InterrogatorComponent', () => {

  it('should create', () => {
    const component = setup();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Word categorization should return empty, if input is empty', () => {
    const component = setup();
    const words: GuessedWord[] = []
    const a = component.categorizeWords(words, true);
    expect(a).toEqual([[]]);
  });

  it('Word categorization 1 word in the 1. group', () => {
    const component = setup();
    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date();
    _1MinuteAgo.setTime(_1MinuteAgo.getTime() - 1000 * 60);
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);
  });

  it('Word categorization 2 word in the 1. group', () => {
    const component = setup();
    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date();
    _1MinuteAgo.setTime(_1MinuteAgo.getTime() - 1000 * 60);
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo));
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(2);
  });

  it('Word categorization 1 word in the 1. group and 2 in the 2. group', () => {
    const component = setup();
    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date(new Date().getTime() - 1000 * 60);
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo));
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo));
    let _5MinuteAgo = new Date(new Date().getTime() - 1000 * 60 * 5);
    words.push(createGuessedWord(_5MinuteAgo, _5MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(2);
    expect(a[0].length).toEqual(1);
    expect(a[1].length).toEqual(2);
  });

});

function createGuessedWord(nextInterrogationTime: Date, lastAnswerTime: Date): GuessedWord {
  return new GuessedWord(new Word(null, [], [], null, null, nextInterrogationTime.toUTCString(), lastAnswerTime.toUTCString()));

}
