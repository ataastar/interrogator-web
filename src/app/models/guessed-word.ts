export class GuessedWord {
    id: number;
    from: string;
    to: string[];
    imageUrl?: string;
    pronunciation?: string;
    audio?: string;
    example?: string;
    translatedExample?: string;

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
