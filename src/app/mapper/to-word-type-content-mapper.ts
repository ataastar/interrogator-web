import { ToPhrase } from '../models/word-type/to-phrase';
import { WordTypeContent } from '../models/word-type/word-type-content';
import { WordTypeLink } from '../models/word-type/word-type-link';

export class ToWordTypeContentMapper {
    static map(content: any): WordTypeContent {
        const links: WordTypeLink[] = []
        for (const row of content.rows) {
            const id = row.id
            const fromPhrases: string[] = row.fromPhrases as string[]
            //const toPhrases = new Map<string, string[]>()
            const toPhrases: ToPhrase[] = []

            for (const [k, v] of Object.entries(row.toPhrases)) {
                toPhrases.push(new ToPhrase(Object.keys(v)[0], v[Object.keys(v)[0]] as string[]))
            }
            links.push(new WordTypeLink(row.id, fromPhrases, toPhrases))
        }
        return new WordTypeContent(content.name, content.forms, links)
    }
}
