import { ToPhrase } from "./to-phrase"

export class WordTypeLink {
    constructor (public id: number, public fromPhrases: string[], public toPhrases: ToPhrase[], public wordTypeUnits: number[]) {
    }
}
