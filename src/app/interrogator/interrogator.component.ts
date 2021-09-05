import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { WordService } from '../services/word-service';
import { GuessedWord } from '../models/guessed-word';

import { switchMap } from 'rxjs/operators';
import { GuessedWordConverter } from './guessed-word-converter';
import { Word } from '../models/word';
import { TextComparator } from './text-comparator';


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
    comparator: TextComparator = new TextComparator();

    constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.actualWords = new GuessedWordConverter().convertToGuessed(this.wordService.getActualWords());
        if (this.actualWords) {
            this.next();
        } else {
            this.route.paramMap
                .pipe(switchMap((params: ParamMap) => {
                    let unitId = params.get('id');
                    if (unitId) {
                        return this.wordService.getWords(params.get('id'));
                    } else {
                        return new Promise<Word[]>((resolve) => { resolve(); });
                    }
                })).subscribe(words => {
                    if (words) {
                        this.actualWords = new GuessedWordConverter().convertToGuessed(words);
                        this.next();
                    }
                });
        }
    }

    check(): void {
        if (this.comparator.isEqual(this.word.to, this.to)) {
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

    next(): void {
        this.word = this.getRandomWord(this.word && this.word.lastAnswerWrong);
        this.checked = false;
        this.wrong = false;
        this.to = null;
        if (this.word != null && document.getElementById('to') != null) {
            document.getElementById('to').focus();
        }
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
