import { Phrase } from "./phrase";

export class Word {
    id: Number;
    from: Phrase[];
    to: Phrase[];
    imageUrl?: String;
    pronunciation?: String;
    audio?: String;
    example?: String;
    translatedExample?: String;
}