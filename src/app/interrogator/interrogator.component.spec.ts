import { InterrogatorComponent } from './interrogator.component';
import { WordService } from '../services/word-service';
import { GuessedWord } from '../models/guessed-word';
import { Word } from '../models/word';
import { Phrase } from '../models/phrase';

function setupWordService() {
  const wordServiceSpy =
    jasmine.createSpyObj('WordService', ['getActualWords']);
  const stubValue = [createGuessedWord(1, new Date(), new Date())];
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
    words.push(createGuessedWord(1, _1MinuteAgo, _1MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);
  });

  it('Word categorization 2 word in the 1. group', () => {
    const component = setup();
    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date();
    _1MinuteAgo.setTime(_1MinuteAgo.getTime() - 1000 * 60);
    words.push(createGuessedWord(1, _1MinuteAgo, _1MinuteAgo));
    words.push(createGuessedWord(1, _1MinuteAgo, _1MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(2);
  });

  it('Word categorization 1 word in the 1. group and 2 in the 2. group', () => {
    const component = setup();
    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date(new Date().getTime() - 1000 * 60);
    words.push(createGuessedWord(1, _1MinuteAgo, _1MinuteAgo));
    words.push(createGuessedWord(2, _1MinuteAgo, _1MinuteAgo));
    let _5MinuteAgo = new Date(new Date().getTime() - 1000 * 60 * 5);
    words.push(createGuessedWord(3, _5MinuteAgo, _5MinuteAgo));
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
    words.push(createGuessedWord(1, _1MinuteAgo, _1MinuteAgo, 'a1', 'b1'));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.needToInterrogate.length).toBe(1);
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
    words.push(createGuessedWord(1, _1MinuteAgo, _1MinuteAgo, 'a1', 'b1'));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    console.log(component.needToInterrogate);
    expect(component.needToInterrogate.length).toBe(1);
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
    const to1 = 'b1';
    const to2 = 'bb1';

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = []
    let _1MinuteAgo = new Date(new Date().getTime() - 1000 * 60);
    const word1 = createGuessedWord(1, _1MinuteAgo, _1MinuteAgo, 'a1', to1)
    words.push(word1);
    const word2 = createGuessedWord(2, _1MinuteAgo, _1MinuteAgo, 'aa1', to2);
    words.push(word2);
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(2);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.needToInterrogate.length).toBe(2);
    expect(component.actualWords.length).toBe(2);

    // right answer
    spyOn(component, 'getRandomWord').and.returnValue(word1);
    component.next();
    component.to = to1;
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(1, 'aa1 is remained in the array');
    expect(component.actualWords[0].word.from[0].phrase).toBe('aa1', 'aa1 is remained in the array');

    // right answer
    component.getRandomWord = jasmine.createSpy().and.returnValue(word2);
    component.next();
    component.to = to2;
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(0, 'Can not be any word to interrogate');

  });

  it('Test fillWordArrays: 5 groups, each contain 1 word -> all need to be added to the actual array -> answer all right', () => {
    const component = setup(setupMockWordService());

    const now = new Date().getTime();
    let _1Minute = 1000 * 60;

    const words: GuessedWord[] = []
    const word1 = addWordToArray(words, 1, 'a', now - _1Minute);
    const word2 = addWordToArray(words, 2, 'b', now - _1Minute * 4);
    const word3 = addWordToArray(words, 3, 'c', now - _1Minute * 4 * 4);
    const word4 = addWordToArray(words, 4, 'd', now - _1Minute * 4 * 4 * 4);
    const word5 = addWordToArray(words, 5, 'e', now - _1Minute * 4 * 4 * 4 * 4);


    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(5);
    expect(a[0].length).toEqual(1);
    expect(a[1].length).toEqual(1);
    expect(a[2].length).toEqual(1);
    expect(a[3].length).toEqual(1);
    expect(a[4].length).toEqual(1);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.needToInterrogate.length).toBe(5);
    expect(component.needToInterrogate[0]).toBe(word5);
    expect(component.actualWords.length).toBe(5);

    // right answer
    spyOn(component, 'getRandomWord').and.returnValue(word2);
    component.next();
    component.to = word2.word.to[0].phrase;
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(4, '4 words are remained in the array');
    expect(component.needToInterrogate.length).toBe(4, 'One of it was interrogated');

    // right answer
    component.getRandomWord = jasmine.createSpy().and.returnValue(word5);
    component.next();
    component.to = word5.word.to[0].phrase;
    component.check();
    expect(component.actualWords.length).toBe(3, '3 words are remained in the array');
    expect(component.needToInterrogate.length).toBe(3, '2 were interrogated');

    // right answer
    component.getRandomWord = jasmine.createSpy().and.returnValue(word1);
    component.next();
    component.to = word1.word.to[0].phrase;
    component.check();
    expect(component.actualWords.length).toBe(2, '3 words are remained in the array');
    expect(component.needToInterrogate.length).toBe(2, '3 were interrogated');

    // right answer
    component.getRandomWord = jasmine.createSpy().and.returnValue(word3);
    component.next();
    component.to = word3.word.to[0].phrase;
    component.check();
    expect(component.actualWords.length).toBe(1, '3 words are remained in the array');

    // right answer
    component.getRandomWord = jasmine.createSpy().and.returnValue(word4);
    component.next();
    component.to = word4.word.to[0].phrase;
    component.check();
    expect(component.actualWords.length).toBe(0, '3 words are remained in the array');

  });

  it('Test fillWordArrays: 6 groups (the last contains 2 word, the others contains just 1 word) -> last 2 no need to be added to the actual array -> 4 wrong answer -> after the first right answer 6. should be added to the actual and the current and 7. should remained in the categorized array', () => {
    const component = setup(setupMockWordService());

    const now = new Date().getTime();
    let _1Minute = 1000 * 60;

    const words: GuessedWord[] = []
    const word1 = addWordToArray(words, 1, 'a', now - _1Minute);
    const word2 = addWordToArray(words, 2, 'b', now - _1Minute);
    const word3 = addWordToArray(words, 3, 'c', now - _1Minute * 4);
    const word4 = addWordToArray(words, 4, 'd', now - _1Minute * 4 * 4);
    const word5 = addWordToArray(words, 5, 'e', now - _1Minute * 4 * 4 * 4);
    const word6 = addWordToArray(words, 6, 'e', now - _1Minute * 4 * 4 * 4 * 4);
    const word7 = addWordToArray(words, 7, 'f', now - _1Minute * 4 * 4 * 4 * 4 * 4);

    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(6);
    expect(a[0].length).toEqual(1);
    expect(a[1].length).toEqual(1);
    expect(a[2].length).toEqual(1);
    expect(a[3].length).toEqual(1);
    expect(a[4].length).toEqual(1);
    expect(a[5].length).toEqual(2);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(1);
    expect(component.categorizedWords[0].length).toBe(2);
    expect(component.needToInterrogate.length).toBe(5);
    expect(component.needToInterrogate[0]).toBe(word7);
    expect(component.actualWords.length).toBe(5);
    /*
        // wrong answer
        spyOn(component, 'getRandomWord').and.returnValue(word7);
        component.next();
        component.to = word1.word.to[0].phrase;
        component.check();
        expect(component.wrong).toBeTruthy('Wrong answer');
        expect(component.actualWords.length).toBe(5, '5 words are remained in the array');
        expect(component.needToInterrogate.length).toBe(5, '5, all ne to be interrogate');

        // right answer
        component.getRandomWord = jasmine.createSpy().and.returnValue(word5);
        component.next();
        component.to = word5.word.to[0].phrase;
        component.check();
        expect(component.actualWords.length).toBe(3, '3 words are remained in the array');
        expect(component.needToInterrogate.length).toBe(0, 'The first was interrogated and the answer was right');

        // right answer
        component.getRandomWord = jasmine.createSpy().and.returnValue(word1);
        component.next();
        component.to = word1.word.to[0].phrase;
        component.check();
        expect(component.actualWords.length).toBe(2, '3 words are remained in the array');
        expect(component.needToInterrogate.length).toBe(0, 'The first was already interrogated');

        // right answer
        component.getRandomWord = jasmine.createSpy().and.returnValue(word3);
        component.next();
        component.to = word3.word.to[0].phrase;
        component.check();
        expect(component.actualWords.length).toBe(1, '3 words are remained in the array');

        // right answer
        component.getRandomWord = jasmine.createSpy().and.returnValue(word4);
        component.next();
        component.to = word4.word.to[0].phrase;
        component.check();
        expect(component.actualWords.length).toBe(0, '3 words are remained in the array');
  */
  });
})
;

function addWordToArray(words: GuessedWord[], id: number, fromPhrase: string, time: number): GuessedWord {
  const word = createGuessedWord(id, new Date(time), new Date(time), fromPhrase, fromPhrase + 'to');
  words.push(word);
  return word;
}

function createGuessedWord(id: number, nextInterrogationTime: Date, lastAnswerTime: Date, fromWord?: string, toWord?: string): GuessedWord {
  return new GuessedWord(new Word(id, [new Phrase(fromWord, 1)], [new Phrase(toWord, 2)], null, null, nextInterrogationTime.toUTCString(), lastAnswerTime.toUTCString()));
}
