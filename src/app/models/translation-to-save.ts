export class TranslationToSave {
    id: String;
    from: String[];
    to: String[];
    imageUrl?: String;
    pronunciation?: String;
    audio?: String;
    example?: String;
    translatedExample?: String;

    constructor(id: String, from: String[], to: String[], example?: String, translatedExample?: String) {
        this.id = id;
        this.from = from;  
        this.to = to;
        this.example = example;
        this.translatedExample = translatedExample;  
    }
}