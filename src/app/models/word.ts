import { Phrase } from "./phrase";

export class Word {
    id: String;
    from: Phrase[];
    to: Phrase[];
    imageUrl?: String;
    pronunciation?: String;
    audio?: String;
    example?: String;
    translatedExample?: String;

    constructor(id: String, from: Phrase[], to: Phrase[], example?: String, translatedExample?: String) {
        this.id = id;
        this.from = from;  
        this.to = to;
        this.example = example;
        this.translatedExample = translatedExample;  
    }
}