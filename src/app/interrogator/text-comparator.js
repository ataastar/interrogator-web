"use strict";
/**
 * Compare the input text with the possible word/sentece
 */
var TextComparator = (function () {
    function TextComparator() {
    }
    TextComparator.prototype.isEqual = function (expectedArray, actual) {
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
    TextComparator.prototype.replaceAbbreviation = function (source) {
        var result = this.replace(source, 'WHAT\'S', 'WHAT IS');
        result = this.replace(source, 'I\'M', 'I AM');
        // result = this.replace(source, 'I\'M', 'I AM');
        return result;
    };
    TextComparator.prototype.replace = function (source, search, replace) {
        return source.replace(new RegExp(search, 'g'), replace);
    };
    TextComparator.prototype.removeUnnecessaryCharacters = function (text) {
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
    return TextComparator;
}());
exports.TextComparator = TextComparator;
//# sourceMappingURL=text-comparator.js.map