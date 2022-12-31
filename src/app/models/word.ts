import { Phrase } from "./phrase";

export class Word {
    id: number;
    from: Phrase[];
    to: Phrase[];
    imageUrl?: string;
    pronunciation?: string;
    audio?: string;
    example?: string;
    translatedExample?: string;

    constructor(id: number, from: Phrase[], to: Phrase[], example?: string, translatedExample?: string) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.example = example;
        this.translatedExample = translatedExample;
    }
}
