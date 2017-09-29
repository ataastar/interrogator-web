"use strict";
var GuessedWord = (function () {
    function GuessedWord() {
        this.lastAnswerWrong = false;
        this.wrongAnswerNumber = 0;
        this.correctAnswerNumber = 0;
    }
    GuessedWord.prototype.getWrongAnswerNumber = function () {
        return this.wrongAnswerNumber;
    };
    GuessedWord.prototype.incrementWrongAnswer = function () {
        this.wrongAnswerNumber++;
        this.lastAnswerWrong = true;
    };
    GuessedWord.prototype.incrementCorrectAnswer = function () {
        this.correctAnswerNumber++;
        this.lastAnswerWrong = false;
    };
    return GuessedWord;
}());
exports.GuessedWord = GuessedWord;
//# sourceMappingURL=guessed-word.js.map