export class GuessedWord {
    hungarian: any;
    english: any;
    imageUrl?: String;
    pronunciation?: String;
    audio?: String;
    exampleInHungarian?: String;
    exampleInEnglish?: String;

    lastAnswerWrong: boolean = false;
    private wrongAnswerNumber: number = 0;
    private correctAnswerNumber: number = 0;

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
