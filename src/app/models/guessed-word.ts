export class GuessedWord {
    hungarian;
    english;
    imageUrl?;
    pronunciation?;

    lastAnswerWrong: boolean = false;
    wrongAnswerNumber: number = 0;
    correctAnswerNumber: number = 0;

    public getWrongAnswerNumber(): number {
        return this.wrongAnswerNumber;
    }

    public incrementWrongAnswer(): void {
        this.wrongAnswerNumber++;
        this.lastAnswerWrong = true;
    }

    public incrementCorrectAnswer(): void {
        this.correctAnswerNumber++;
        this.lastAnswerWrong = false;
    }
}
