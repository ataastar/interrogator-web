import { InterrogatorComponent } from './interrogator.component';
import { GuessedWord } from '../models/guessed-word';
import { Translation, TranslationPart } from '@ataastar/interrogator-api-ts-oa';

function setupWordService() {
  const wordServiceSpy =
    jasmine.createSpyObj('WordService', ['getActualWords']);
  const stubValue = [createTranslation(1, new Date(), new Date())];
  wordServiceSpy.getActualWords.and.returnValue(stubValue);
  return wordServiceSpy;
}

function setupMockWordService() {
  return jasmine.createSpyObj('WordService', ['wrongAnswer', 'rightAnswer']);
}

function setup(wordService?): InterrogatorComponent {
  return new InterrogatorComponent(wordService, null, null);
}

const _1Minute = 1000 * 60;

describe('InterrogatorComponent', () => {

  it('should create', () => {
    const component = setup(setupWordService());
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Word categorization should return empty, if input is empty', () => {
    const component = setup();
    const words: GuessedWord[] = [];
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(0);
  });

  it('Word categorization 1 word in the 1. group', () => {
    const component = setup();
    const words: GuessedWord[] = [];
    const _1MinuteAgo = new Date();
    _1MinuteAgo.setTime(_1MinuteAgo.getTime() - _1Minute);
    words.push(createTranslation(1, _1MinuteAgo, _1MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);
  });

  it('Word categorization 2 word in the 1. group', () => {
    const component = setup();
    const words: GuessedWord[] = [];
    const _1MinuteAgo = new Date();
    _1MinuteAgo.setTime(_1MinuteAgo.getTime() - _1Minute);
    words.push(createTranslation(1, _1MinuteAgo, _1MinuteAgo));
    words.push(createTranslation(1, _1MinuteAgo, _1MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(2);
  });

  it('Word categorization 1 word in the 1. group and 2 in the 2. group', () => {
    const component = setup();
    const words: GuessedWord[] = [];
    const _1MinuteAgo = new Date(new Date().getTime() - _1Minute);
    words.push(createTranslation(1, _1MinuteAgo, _1MinuteAgo));
    words.push(createTranslation(2, _1MinuteAgo, _1MinuteAgo));
    const _5MinuteAgo = new Date(new Date().getTime() - _1Minute * 5);
    words.push(createTranslation(3, _5MinuteAgo, _5MinuteAgo));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(2);
    expect(a[0].length).toEqual(1);
    expect(a[1].length).toEqual(2);
  });

  it('Interrogation workflow with 1 word. 1 Right answer', () => {
    const component = setup(setupMockWordService());

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = [];
    const _1MinuteAgo = new Date(new Date().getTime() - _1Minute);
    words.push(createTranslation(1, _1MinuteAgo, _1MinuteAgo, 'a1', 'b1'));
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
    expect(component.currentlyAnswered.length).toBe(0, 'No any wrongly answered word');

  });

  it('Interrogation workflow with 1 word. 1 wrong answer, 1 right answer', () => {
    const component = setup(setupMockWordService());

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = [];
    const _1MinuteAgo = new Date(new Date().getTime() - _1Minute);
    words.push(createTranslation(1, _1MinuteAgo, _1MinuteAgo, 'a1', 'b1'));
    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(1);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.needToInterrogate.length).toBe(1);
    expect(component.actualWords.length).toBe(1);

    // wrong answer
    component.next();
    component.to = 'c3';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeTruthy('the answer was wrong');
    expect(component.actualWords.length).toBe(1, 'the 1 word is should be interrogated');
    expect(component.currentlyAnswered.length).toBe(0, '1 wrongly answered word, but it is the last');

    // right answer
    component.next();
    component.to = 'b1';
    component.check();
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.wrong).toBeFalsy('the answer right, so can\'t be wrong');
    expect(component.actualWords.length).toBe(0, 'Can not be any word to interrogate');
    expect(component.currentlyAnswered.length).toBe(0, '1 wrongly answered word, but it is the last');

  });

  it('Interrogation workflow with 2 words. 2 right answers', () => {
    const component = setup(setupMockWordService());
    const to1 = 'b1';
    const to2 = 'bb1';

    expect(component.fillWordArrays()).toBeFalsy();

    const words: GuessedWord[] = [];
    const _1MinuteAgo = new Date(new Date().getTime() - _1Minute);
    const word1 = createTranslation(1, _1MinuteAgo, _1MinuteAgo, 'a1', to1);
    words.push(word1);
    const word2 = createTranslation(2, _1MinuteAgo, _1MinuteAgo, 'aa1', to2);
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
    checkAndAssertAnswer(component, word1, word1, 1, 'aa1 is remained in the array', 1, 'One of it was interrogated', 0, 'No any wrongly answered word');
    expect(component.checked).toBeTruthy('to be checked');
    expect(component.actualWords[0].translation.from[0].phrase).toBe('aa1', 'aa1 is remained in the array');

    // right answer
    checkAndAssertAnswer(component, word2, word2, 0, 'Can not be any word to interrogate', 0, 'all was interrogated', 0, 'No any wrongly answered word');
    expect(component.checked).toBeTruthy('to be checked');
  });

  it('Test fillWordArrays: 5 groups, each contain 1 word -> all need to be added to the actual array -> answer all right', () => {
    const component = setup(setupMockWordService());

    const now = new Date().getTime();

    const words: GuessedWord[] = [];
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
    checkAndAssertAnswer(component, word2, word2, 4, '4 words are remained in the array', 4, 'One of it was interrogated', 1);
    expect(component.checked).toBeTruthy('to be checked');
    // right answer
    checkAndAssertAnswer(component, word5, word5, 3, '3 words are remained in the array', 3, '2 were interrogated', 1);
    // right answer
    checkAndAssertAnswer(component, word1, word1, 2, '2 words are remained in the array', 2, '3 were interrogated', 1);
    // right answer
    checkAndAssertAnswer(component, word3, word3, 1, '1 word is remained in the array', 1, '4 were interrogated', 0);
    // right answer
    checkAndAssertAnswer(component, word4, word4, 0, '0 word is remained in the array', 0, '5 were interrogated', 0);

  });

  it('Test fillWordArrays: 6 groups (the last contains 2 word, the others contains just 1 word) -> last 2 no need to be added to the actual array ' +
    '-> 2 wrong answer -> 3. answer is right -> 6. words should be added to the actual -> wrong answer for the remaining words -> 7. word should remained in the categorized array', () => {
    const component = setup(setupMockWordService());

    const now = new Date().getTime();

    const words: GuessedWord[] = [];
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

    // wrong answer
    spyOn(component, 'getRandomWord').and.returnValue(word7);
    checkAndAssertAnswer(component, word7, word1, 5, '5 words are remained in the array', 5, '5, all ne to be interrogate', 1, '1 wrongly answered word');
    // wrong answer
    checkAndAssertAnswer(component, word6, word1, 5, '5 words are remained in the array', 5, '5, all ne to be interrogate', 2, '2 wrongly answered words');
    // right answer
    checkAndAssertAnswer(component, word5, word5, 5, '5-1+1 words are remained in the array', 4, '5-1 should be interrogated', 3, '2 wrongly answered words');
    // wrong answer
    checkAndAssertAnswer(component, word4, word1, 5, '5-1+1 words are remained in the array', 4, '5-1 should be interrogated', 3, '3 wrongly answered words');
    // wrong answer
    checkAndAssertAnswer(component, word3, word1, 5, '5-1+1 words are remained in the array', 4, '5-1 should be interrogated', 3, '4 wrongly answered words');
    // wrong answer
    checkAndAssertAnswer(component, word2, word1, 4, '5-1+1 words are remained in the array', 4, '5-1 should be interrogated', 2, '5 wrongly answered words');
    // check wrong answer count on words
    expect(word7.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word7.lastAnswerWrong).toBeTruthy('Was answered once wrongly');
    expect(word6.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word5.getWrongAnswerNumber()).toBe(0, 'Was answered once rightly');
    expect(word5.lastAnswerWrong).toBeFalsy('Was answered once rightly');
    expect(word4.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word3.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word2.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');

  });

  it('Test wrongNumberCount check: 7 words in 1 group (1 right, 5 wrong answer -> last word must not interrogate)', () => {
    const component = setup(setupMockWordService());

    const now = new Date().getTime();

    const words: GuessedWord[] = [];
    const word1 = addWordToArray(words, 1, 'a', now - _1Minute);
    const word2 = addWordToArray(words, 2, 'b', now - _1Minute);
    const word3 = addWordToArray(words, 3, 'c', now - _1Minute);
    const word4 = addWordToArray(words, 4, 'd', now - _1Minute);
    const word5 = addWordToArray(words, 5, 'e', now - _1Minute);
    const word6 = addWordToArray(words, 6, 'e', now - _1Minute);
    const word7 = addWordToArray(words, 7, 'f', now - _1Minute);

    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(1);
    expect(a[0].length).toEqual(7);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(0);
    expect(component.needToInterrogate.length).toBe(7);
    expect(component.actualWords.length).toBe(7);

    // wrong answer
    spyOn(component, 'getRandomWord').and.returnValue(word7);
    checkAndAssertAnswer(component, word7, word1, 7, '7 words are remained in the array', 7, '7, all need to be interrogate', 1, '1 wrongly answered word');
    // wrong answer
    checkAndAssertAnswer(component, word6, word1, 7, '7 words are remained in the array', 7, '7, all need to be interrogate', 2, '2 wrongly answered word');
    // right answer
    checkAndAssertAnswer(component, word5, word5, 6, '7-1 words are remained in the array', 6, '7-1 should be interrogated', 3, '2 wrongly answered word');
    // wrong answer
    checkAndAssertAnswer(component, word4, word1, 6, '7-1 words are remained in the array', 6, '7-1 should be interrogated', 3, '3 wrongly answered word');
    // right answer word4
    checkAndAssertAnswer(component, word4, word4, 6, '7-1 words are remained in the array', 6, '7-1 should be interrogated', 3, '3 wrongly answered word');
    // right answer word4
    checkAndAssertAnswer(component, word4, word4, 5, '7-2 words are remained in the array', 5, '7-1 should be interrogated', 3, '3 wrongly answered word');
    // wrong answer
    checkAndAssertAnswer(component, word3, word1, 5, '7-2 words are remained in the array', 5, '7-1 should be interrogated', 3, '4 wrongly answered word');
    // wrong answer
    checkAndAssertAnswer(component, word2, word1, 4, '5 wrong answer is reached and 1 is removed already', 5, 'It is does not matter when the 5 wrong answers are reached ', 2, '5 wrongly answered word');
    // check wrong answer count on words
    expect(word7.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word7.lastAnswerWrong).toBeTruthy('Was answered once wrongly');
    expect(word6.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word5.getWrongAnswerNumber()).toBe(0, 'Was answered once rightly');
    expect(word5.lastAnswerWrong).toBeFalsy('Was answered once rightly');
    expect(word4.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word3.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word2.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word1.getWrongAnswerNumber()).toBe(0, 'Was not interrogated');

  });

  it('Test fillWordArrays: 3 groups (2 words in 1. group, 2 word in the 2. group, 6 words in the 3. group) -> 1. and 2. are wrong -> ' +
    'no any change in the groups -> remaining word\'s answer are right -> ' +
    'after every right answer the actual is filled with 1 word (right is removed, new is added), but after the 3. right answer, all the word should be filled from the 3. group,' +
    'because 1. and 2. group contain just wrong answer, so all the words which were in the 1. and 2. group will be interrogated, so should be added the next (3.) group of words to the actual and needToInterrogate array', () => {
    const component = setup(setupMockWordService());

    const now = new Date().getTime();

    const words: GuessedWord[] = [];
    const word1 = addWordToArray(words, 1, 'a', now - _1Minute * 4 * 4);
    const word2 = addWordToArray(words, 2, 'b', now - _1Minute * 4 * 4);
    const word3 = addWordToArray(words, 3, 'c', now - _1Minute * 4);
    const word4 = addWordToArray(words, 4, 'd', now - _1Minute * 4);
    addWordToArray(words, 5, 'e', now - _1Minute);
    addWordToArray(words, 6, 'f', now - _1Minute);
    const word7 = addWordToArray(words, 7, 'g', now - _1Minute);
    addWordToArray(words, 8, 'h', now - _1Minute);
    addWordToArray(words, 9, 'i', now - _1Minute);

    const a = component.categorizeWords(words, true);
    expect(a.length).toEqual(3);
    expect(a[0].length).toEqual(2);
    expect(a[1].length).toEqual(2);
    expect(a[2].length).toEqual(5);

    expect(component.fillWordArrays()).toBeTruthy();
    expect(component.categorizedWords.length).toBe(1);
    expect(component.categorizedWords[0].length).toBe(5);
    expect(component.needToInterrogate.length).toBe(4, 'One is from the last group, which no need to add to this array');
    expect(component.needToInterrogate[0]).toBe(word1);
    expect(component.actualWords.length).toBe(5);

    // wrong answer
    spyOn(component, 'getRandomWord').and.returnValue(word1);
    checkAndAssertAnswer(component, word1, word7, 5, '5 words are remained in the array', 4, 'all need to be interrogate', 1);
    expect(word1.getWrongAnswerNumber()).toBe(1, 'Was answered once wrongly');
    expect(word1.lastAnswerWrong).toBeTruthy('Was answered once wrongly');
    // wrong answer
    checkAndAssertAnswer(component, word3, word7, 5, '5 words are remained in the array', 4, 'all need to be interrogate', 2);
    // right answer
    checkAndAssertAnswer(component, word2, word2, 5, '5-1+1 words are remained in the array', 3, '4-1 should be interrogated', 3);
    expect(word2.lastAnswerWrong).toBeFalsy('Was answered once rightly');
    // right answer
    checkAndAssertAnswer(component, word4, word4, 7, '5-2+2 (+ 3: remaining from the last group) words are remained in the array', 7, '4-2 (+ 5 all from the last group) should be interrogated', 3);
  });

  it('Test getRandomWord', () => {
    const component = setup(setupMockWordService());

    const w1 = createTranslation(1);
    const w2 = createTranslation(2);
    const w3 = createTranslation(3);
    const w4 = createTranslation(4);
    const w5 = createTranslation(5);

    spyOn(component, 'getRandomIndex').and.returnValue(w1.word.id);

    expect(component.getRandomWord()).toBeNull(); // empty
    component.actualWords.push(w1);
    expect(component.getRandomWord()).toEqual(w1); // actual: 1
    component.currentlyAnswered.push(w1);
    expect(component.getRandomWord()).toBeNull(); // actual: 1 current: 1
    component.actualWords.push(w2);
    component.getRandomIndex = jasmine.createSpy().and.returnValue(0);
    //component.currentlyAnswered.push(w2);
    expect(component.getRandomWord()).toEqual(w2); // actual: 1,2 current: 1 remaining: 2 random: 0.
    component.getRandomIndex = jasmine.createSpy().and.returnValue(1);
    component.actualWords.push(w3);
    expect(component.getRandomWord()).toEqual(w3); // actual: 1,2,3 current: 1 remaining: 2,3 random: 1.
    component.currentlyAnswered.push(w5);
    component.getRandomIndex = jasmine.createSpy().and.returnValue(0);
    expect(component.getRandomWord()).toEqual(w2); // actual: 1,2,3 current: 1,5 remaining: 2,3 random: 0.
    component.actualWords.push(w4);
    component.actualWords.push(w5);
    component.getRandomIndex = jasmine.createSpy().and.returnValue(2);
    expect(component.getRandomWord()).toEqual(w4); // actual: 1,2,3,4,5 current: 1,5 remaining: 2,3,4 random: 2.
    component.currentlyAnswered.push(w3);
    component.getRandomIndex = jasmine.createSpy().and.returnValue(1);
    expect(component.getRandomWord()).toEqual(w4); // actual: 1,2,3,4,5 current: 1,5,3 remaining: 2,4 random: 1.
  });

})
;

function checkAndAssertAnswer(c: InterrogatorComponent, nextWord: GuessedWord, answerWord: GuessedWord, expectedActualWordLength: number, expectedActualWordLengthExp: string, needToInterrogateLength: number, needToInterrogateLengthExp: string, expectedCurrentlyAnsweredLength?: number, expectedCurrentlyAnsweredLengthExp?: string) {
  c.getRandomWord = jasmine.createSpy().and.returnValue(nextWord);
  c.next();
  c.to = answerWord.translation.to[0].phrase;
  c.check();
  if (answerWord == nextWord) {
    expect(c.wrong).toBeFalsy('Right answer');
  } else {
    expect(c.wrong).toBeTruthy('Wrong answer');
  }
  expect(c.actualWords.length).toBe(expectedActualWordLength, expectedActualWordLengthExp);
  expect(c.needToInterrogate.length).toBe(needToInterrogateLength, needToInterrogateLengthExp);
  if (expectedCurrentlyAnsweredLength != undefined) {
    expect(c.currentlyAnswered.length).toBe(expectedCurrentlyAnsweredLength, expectedCurrentlyAnsweredLengthExp);
  }
}

function addWordToArray(words: GuessedWord[], id: number, fromPhrase: string, time: number): GuessedWord {
  const word = createTranslation(id, new Date(time), new Date(time), fromPhrase, fromPhrase + 'to');
  words.push(word);
  return word;
}

function createTranslation(unitContentId: number, lastAnswerTime?: Date, nextInterrogationTime?: Date, fromPhrase?: string, toPhrase?: string): Translation {
  const phrasesByLanguageId: { [p: string]: TranslationPart[] } = {};
  if (fromPhrase) {
    phrasesByLanguageId[1] = [{ fromPhrase }];
  }
  if (toPhrase) {
    phrasesByLanguageId[2] = this.toPhrase;
  }
  return {
    unitContentId: unitContentId,
    lastAnswerTime: lastAnswerTime ? lastAnswerTime.toUTCString() : null,
    nextInterrogationTime: nextInterrogationTime ? nextInterrogationTime.toUTCString() : null,
    phrasesByLanguageId: phrasesByLanguageId
  };
}
