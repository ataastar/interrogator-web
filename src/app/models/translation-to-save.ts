export class TranslationToSave {
    id: string;
    from: string[];
    to: string[];
    imageUrl?: string;
    pronunciation?: string;
    audio?: string;
    example?: string;
    translatedExample?: string;

    constructor(id: string, from: string[], to: string[], example?: string, translatedExample?: string) {
        this.id = id;
        this.from = from;  
        this.to = to;
        this.example = example;
        this.translatedExample = translatedExample;  
    }
}