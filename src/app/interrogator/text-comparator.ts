/**
 * Compare the input text with the possible word/sentece
 */
export class TextComparator {

    constructor() {
    }

    isEqual(expectedArray: string[], actual: string) {
        if (actual === null) { return; }
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

    replaceAbbreviation(source) {
        let result = this.replace(source, 'WHAT\'S', 'WHAT IS');
        result = this.replace(source, 'I\'M', 'I AM');
        // result = this.replace(source, 'I\'M', 'I AM');
        return result;
    }

    private replace(source, search, replace) {
        return source.replace(new RegExp(search, 'g'), replace);
    }

    private removeUnnecessaryCharacters(text: any) {
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

}
