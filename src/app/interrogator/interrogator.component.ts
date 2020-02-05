import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { WordService } from '../services/word-service';
import { Word } from '../models/word';
import { GuessedWord } from '../models/guessed-word';

import { switchMap } from 'rxjs/operators';


@Component({
    selector: 'interrogator',
    templateUrl: './interrogator.component.html',
    styleUrls: ['./interrogator.component.css'],
})
export class InterrogatorComponent {

    actualWords: GuessedWord[] = null;
    word: GuessedWord = null;
    index: number;
    to: string;
    checked: boolean = false;
    wrong: boolean = false;

    constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(switchMap((params: ParamMap) => {
                return this.wordService.getWords(params.get('id'));
            })).subscribe(words => { this.actualWords = this.convertToGuessed(words); this.next(); });
    }

    private convertToGuessed(words: Word[]): GuessedWord[] {
        if (words == null) { return null; }
        let actualWords = new Array(words.length);
        let i = 0;
        for (let word of words) {
            actualWords[i] = this.clone(word);
            i++;
        }
        return actualWords;
    }

    check(): void {
        if (this.isEqual(this.word.to, this.to)) {
            // if this is the last or the last answer was not wrong, then remove from the array
            if (!this.word.lastAnswerWrong || this.actualWords.length === 1) {
                this.actualWords.splice(this.index, 1);
            }
            this.word.incrementCorrectAnswer();
        } else {
            this.word.incrementWrongAnswer();
            this.wrong = true;
        }
        this.checked = true;
        // play the audio if available
        if (this.word.audio) {
            let player: any = document.getElementById('audioplayer');
            player.play();
        }
    }

    private isEqual(expectedArray: String[], actual: String): boolean {
        if (actual === null) { return false; }
        for (let expected of expectedArray) {
            if (expected === actual) { return true; }
            let expectedModified = expected.toUpperCase();
            let actualModified = actual.toUpperCase();
            if (expectedModified === actualModified) { return true; }

            expectedModified = this.replaceAbbreviation(expectedModified);
            actualModified = this.replaceAbbreviation(actualModified);
            if (expectedModified === actualModified) { return true; }

            expectedModified = this.removeUnnecessaryCharacters(expectedModified);
            actualModified = this.removeUnnecessaryCharacters(actualModified);
            if (expectedModified === actualModified) { return true; }
        }
        return false;
    }

    replaceAbbreviation(source: String) {
        let result = this.replace(source, 'WHAT\'S', 'WHAT IS');
        result = this.replace(source, 'I\'M', 'I AM');
        // result = this.replace(source, 'I\'M', 'I AM');
        return result;
    }

    private replace(source: String, search: any, replace: string): string {
        return source.replace(new RegExp(search, 'g'), replace);
    }

    private removeUnnecessaryCharacters(text: any): string {
        let result = '';
        for (let char of text) {
            switch (char) {
                case '?':
                case '.':
                case '!':
                case ':':
                case ',':
                case ';':
                case ' ':
                    break;
                default:
                    result = result + char;
            }
        }
        return result;
    }

    next(): void {
        this.word = this.getRandomWord(this.word && this.word.lastAnswerWrong);
        this.checked = false;
        this.wrong = false;
        this.to = null;
        if (this.word != null && document.getElementById('to') != null) {
            document.getElementById('to').focus();
        }
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
            cloned.from = phrase.phrase + ";";
        }
        cloned.to = new Array(source.to.length);
        let i = 0;
        for (const phrase of source.to) {
            cloned.to[i] = phrase.phrase;
            i++;
        }
        return cloned;
    }

    /**
     * @param checkSameIndex true, if must not get the same word as it was answered now
     */
    getRandomWord(checkSameIndex: boolean): GuessedWord {
        let remainingWordsNumber = this.actualWords != null ? this.actualWords.length : 0;
        // if no more words, then return null
        if (remainingWordsNumber === 0) {
            return null;
        } else {
            let tempIndex: number = this.getRandomIndex(remainingWordsNumber);
            // if this is the last, then no need to get new random number
            if (checkSameIndex && remainingWordsNumber > 1) {
                while (this.index === tempIndex) {
                    tempIndex = this.getRandomIndex(remainingWordsNumber);
                }
            }
            this.index = tempIndex;
            return this.actualWords[this.index];
        }
    }

    getRandomIndex(length: number): number {
        return Math.floor(Math.random() * length);
    }

    getImageUrl() {
        return //require('../../assets/images/' + this.word.imageUrl);
    }

    getAudio() {
        return //require('../../assets/audios/' + this.word.audio);
    }

    back(): void {
        this.router.navigate(['']);
    }
}
