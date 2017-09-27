export class Word {
    hungarian;
    english;
    imageUrl?;
    pronunciation?;

    lastAnswerWrong: boolean = false;
    wrongAnswerNumber: number = 0;
    correctAnswerNumber: number = 0;

}
