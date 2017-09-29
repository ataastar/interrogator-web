"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
require("../assets/css/styles.css");
require("../../node_modules/primeng/resources/themes/omega/theme.css");
require("../../node_modules/primeng/resources/primeng.min.css");
require("../../node_modules/font-awesome/css/font-awesome.min.css");
var word_service_1 = require("./services/word-service");
var guessed_word_1 = require("./models/guessed-word");
var AppComponent = (function () {
    function AppComponent(wordService) {
        this.wordService = wordService;
        this.actualWords = null;
        this.word = null;
        this.checked = false;
        this.wrong = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.wordService.getWords().then(function (words) {
            _this.words = words;
            _this.actualWords = words;
            // let's get the first one
            _this.next();
        });
    };
    AppComponent.prototype.check = function () {
        if (this.isEqual(this.word.english, this.english)) {
            this.word.incrementCorrectAnswer();
            // if this is the last, then remove from the array
            if (!this.word.lastAnswerWrong || this.actualWords.length === 1) {
                this.actualWords.splice(this.index, 1);
            }
        }
        else {
            this.word.incrementWrongAnswer();
            this.wrong = true;
        }
        this.checked = true;
    };
    AppComponent.prototype.isEqual = function (expectedArray, actual) {
        if (actual === null) {
            return;
        }
        var result = false;
        for (var _i = 0, expectedArray_1 = expectedArray; _i < expectedArray_1.length; _i++) {
            var expected = expectedArray_1[_i];
            result = expected === actual;
            result = result || expected.toUpperCase() === actual.toUpperCase();
            result = result || this.removeUnnecessaryCharacters(expected).toUpperCase() ===
                this.removeUnnecessaryCharacters(actual).toUpperCase();
            if (result) {
                return result;
            }
        }
        return result;
    };
    AppComponent.prototype.removeUnnecessaryCharacters = function (text) {
        var result = '';
        for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
            var char = text_1[_i];
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
    };
    AppComponent.prototype.next = function () {
        var word = this.getRandomWord(this.word && this.word.getWrongAnswerNumber() > 0);
        if (word instanceof guessed_word_1.GuessedWord || word == null) {
            this.word = word;
        }
        else {
            // if the word is not GuessedWord, then we create one and replace
            var newWord = new guessed_word_1.GuessedWord();
            this.clone(word, newWord);
            this.word = newWord;
            this.actualWords[this.index] = this.word;
        }
        this.checked = false;
        this.wrong = false;
        this.english = null;
    };
    AppComponent.prototype.clone = function (source, target) {
        // tslint:disable-next-line:forin
        for (var prop in source) {
            target[prop] = source[prop];
        }
        return target;
    };
    AppComponent.prototype.getRandomWord = function (checkSameIndex) {
        var remainingWordsNumber = this.actualWords.length;
        // if no more words, then return null
        if (remainingWordsNumber === 0) {
            return null;
        }
        else {
            var tempIndex = this.getRandomIndex(remainingWordsNumber);
            // if this is the last, then no need to get new random number
            if (checkSameIndex && remainingWordsNumber > 1) {
                while (this.index === tempIndex) {
                    tempIndex = this.getRandomIndex(remainingWordsNumber);
                }
            }
            this.index = tempIndex;
            return this.actualWords[this.index];
        }
    };
    AppComponent.prototype.getRandomIndex = function (length) {
        return Math.floor(Math.random() * length);
    };
    AppComponent.prototype.getImageUrl = function () {
        return require('../assets/images/' + this.word.imageUrl);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'learn-english-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
    }),
    __metadata("design:paramtypes", [word_service_1.WordService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map