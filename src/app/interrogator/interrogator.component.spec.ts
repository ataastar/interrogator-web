import { InterrogatorComponent } from './interrogator.component';
import { WordService } from '../services/word-service';
import { GuessedWord } from '../models/guessed-word';
import { Word } from '../models/word';
import { Phrase } from '../models/phrase';

function setupWordService() {
  const wordServiceSpy =
    jasmine.createSpyObj('WordService', ['getActualWords']);
  const stubValue = [createGuessedWord(new Date(), new Date())];
  wordServiceSpy.getActualWords.and.returnValue(stubValue);
  return wordServiceSpy;
}

function setupMockWordService() {
  return jasmine.createSpyObj('WordService', ['wrongAnswer', 'rightAnswer']);
}

function setup(wordService?): InterrogatorComponent {
  return new InterrogatorComponent(wordService, null, null);
}

describe('InterrogatorComponent', () => {

  it('should create', () => {
    const component = setup(setupWordService());
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Word categorization should return empty, if input is empty', () => {
    const component = setup();
    const words: GuessedWord[] = []
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(0);
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

  it('Interrogation workflow with 1 word. 1 Right answer', () => {
    const component = setup(setupMockWordService());

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date(new Date().getTime() - 1000 * 60);
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo, 'a1', 'b1'));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.currentWordArray.length).toBe(1);
    expect(component.actualWords.length).toBe(1);

    component.next();
    component.to = 'b1';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(0, 'Can not be any word to interrogate');

  });

  it('Interrogation workflow with 1 word. 1 wrong answer, 1 right answer', () => {
    const component = setup(setupMockWordService());

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date(new Date().getTime() - 1000 * 60);
    words.push(createGuessedWord(_1MinuteAgo, _1MinuteAgo, 'a1', 'b1'));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.currentWordArray.length).toBe(1);
    expect(component.actualWords.length).toBe(1);

    // wrong answer
    component.next();
    component.to = 'c3';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeTruthy('the answer was wrong');
    expect(component.actualWords.length).toBe(1, 'the 1 word is should be interrogated');

    // right answer
    component.next();
    component.to = 'b1';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(0, 'Can not be any word to interrogate');

  });

  it('Interrogation workflow with 2 words. 2 right answers', () => {
    const component = setup(setupMockWordService());

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date(new Date().getTime() - 1000 * 60);
    const word1 = createGuessedWord(_1MinuteAgo, _1MinuteAgo, 'a1', 'b1')
    words.push(word1);
    const word2 = createGuessedWord(_1MinuteAgo, _1MinuteAgo, 'aa1', 'bb1');
    words.push(word2);
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(2);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.currentWordArray.length).toBe(2);
    expect(component.actualWords.length).toBe(2);

    // right answer
    spyOn(component, 'getRandomWord').and.returnValue(word1);
    component.next();
    component.to = 'b1';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(1, 'aa1 is remained in the array');
    expect(component.actualWords[0].word.from[0].phrase).toBe('aa1', 'aa1 is remained in the array');

    // right answer
    component.getRandomWord = jasmine.createSpy().and.returnValue(word2);
    component.next();
    component.to = 'bb1';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(0, 'Can not be any word to interrogate');

  });
});

function createGuessedWord(nextInterrogationTime: Date, lastAnswerTime: Date, fromWord?: string, toWord?: string): GuessedWord {
  return new GuessedWord(new Word(null, [new Phrase(fromWord, 1)], [new Phrase(toWord, 2)], null, null, nextInterrogationTime.toUTCString(), lastAnswerTime.toUTCString()));
}
