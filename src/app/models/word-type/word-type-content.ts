import { WordTypeLink } from "./word-type-link";
import { WordTypeUnit } from "./word-type-unit";

export class WordTypeContent {
    constructor(public name: string, public forms: string[], public links: WordTypeLink[], public wordTypeUnits: WordTypeUnit[]) { }
}
