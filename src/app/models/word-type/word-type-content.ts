import { WordTypeLink } from "./word-type-link";

export class WordTypeContent {
    constructor(public name: string, public forms: string[], public links: WordTypeLink[]) { }
}
