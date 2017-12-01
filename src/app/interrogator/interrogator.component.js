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
var router_1 = require("@angular/router");
var word_service_1 = require("../services/word-service");
var guessed_word_1 = require("../models/guessed-word");
var InterrogatorComponent = (function () {
    function InterrogatorComponent(wordService, route, router) {
        this.wordService = wordService;
        this.route = route;
        this.router = router;
        this.actualWords = null;
        this.word = null;
        this.checked = false;
        this.wrong = false;
    }
    InterrogatorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.paramMap
            .switchMap(function (params) {
            return _this.wordService.getWords(params.get('id'));
        })
            .subscribe(function (words) { _this.actualWords = words; _this.next(); });
        // .subscribe(group => { this.actualWords = group[0].words; console.log(group[0]); this.next(); });
        // this.wordService.getGroups().then(groups => console.log(groups));
        // this.route.url.subscribe(url => { console.log(url[0].path); });
    };
    InterrogatorComponent.prototype.check = function () {
        if (this.isEqual(this.word.english, this.english)) {
            // if this is the last, then remove from the array
            if (!this.word.lastAnswerWrong || this.actualWords.length === 1) {
                this.actualWords.splice(this.index, 1);
            }
            this.word.incrementCorrectAnswer();
        }
        else {
            this.word.incrementWrongAnswer();
            this.wrong = true;
        }
        this.checked = true;
        // play the audio if available
        if (this.word.audio) {
            var player = document.getElementById('audioplayer');
            player.play();
        }
    };
    InterrogatorComponent.prototype.isEqual = function (expectedArray, actual) {
        if (actual === null) {
            return;
        }
        for (var _i = 0, expectedArray_1 = expectedArray; _i < expectedArray_1.length; _i++) {
            var expected = expectedArray_1[_i];
            if (expected === actual) {
                return true;
            }
            var expectedModified = expected.toUpperCase();
            var actualModified = actual.toUpperCase();
            if (expectedModified === actualModified) {
                return true;
            }
            expectedModified = this.replaceAbbreviation(expectedModified);
            actualModified = this.replaceAbbreviation(actualModified);
            if (expectedModified === actualModified) {
                return true;
            }
            expectedModified = this.removeUnnecessaryCharacters(expectedModified);
            actualModified = this.removeUnnecessaryCharacters(actualModified);
            if (expectedModified === actualModified) {
                return true;
            }
        }
        return false;
    };
    InterrogatorComponent.prototype.replaceAbbreviation = function (source) {
        var result = this.replace(source, 'WHAT\'S', 'WHAT IS');
        result = this.replace(source, 'I\'M', 'I AM');
        result = this.replace(source, 'I\'M', 'I AM');
        return result;
    };
    InterrogatorComponent.prototype.replace = function (source, search, replace) {
        return source.replace(new RegExp(search, 'g'), replace);
    };
    InterrogatorComponent.prototype.removeUnnecessaryCharacters = function (text) {
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
    InterrogatorComponent.prototype.next = function () {
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
        if (this.word != null && document.getElementById('english') != null) {
            document.getElementById('english').focus();
        }
    };
    InterrogatorComponent.prototype.clone = function (source, target) {
        // tslint:disable-next-line:forin
        for (var prop in source) {
            target[prop] = source[prop];
        }
        return target;
    };
    InterrogatorComponent.prototype.getRandomWord = function (checkSameIndex) {
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
    InterrogatorComponent.prototype.getRandomIndex = function (length) {
        return Math.floor(Math.random() * length);
    };
    InterrogatorComponent.prototype.getImageUrl = function () {
        return require('../../assets/images/' + this.word.imageUrl);
    };
    InterrogatorComponent.prototype.getAudio = function () {
        return require('../../assets/audios/' + this.word.audio);
    };
    InterrogatorComponent.prototype.back = function () {
        this.router.navigate(['']);
    };
    return InterrogatorComponent;
}());
InterrogatorComponent = __decorate([
    core_1.Component({
        selector: 'interrogator',
        templateUrl: './interrogator.component.html',
        styleUrls: ['./interrogator.component.css'],
    }),
    __metadata("design:paramtypes", [word_service_1.WordService, router_1.ActivatedRoute, router_1.Router])
], InterrogatorComponent);
exports.InterrogatorComponent = InterrogatorComponent;
//# sourceMappingURL=interrogator.component.js.map