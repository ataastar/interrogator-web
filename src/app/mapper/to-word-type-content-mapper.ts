import { ToPhrase } from '../models/word-type/to-phrase';
import { WordTypeContent } from '../models/word-type/word-type-content';
import { WordTypeLink } from '../models/word-type/word-type-link';
import { WordTypeUnit } from '../models/word-type/word-type-unit';

export class ToWordTypeContentMapper {
  static map(content: any): WordTypeContent {
    const links: WordTypeLink[] = [];
    for (const row of content.rows) {
      const fromPhrases: string[] = row.fromPhrases as string[];
      const toPhrases: ToPhrase[] = [];
      for (const [, v] of Object.entries(row.toPhrases)) {
        toPhrases.push(new ToPhrase(Object.keys(v)[0], v[Object.keys(v)[0]] as string[]));
      }
      const wordTypeUnitIds: number[] = row.wordTypeUnits ? row.wordTypeUnits as number[] : [];
      links.push(new WordTypeLink(row.id, fromPhrases, toPhrases, wordTypeUnitIds));
    }
    const wordTypeUnits: WordTypeUnit[] = [];
    if (content.wordTypeUnits) {
      for (const wordTypeUnit of content.wordTypeUnits) {
        wordTypeUnits.push(new WordTypeUnit(Number(Object.keys(wordTypeUnit)[0]), wordTypeUnit[Object.keys(wordTypeUnit)[0]]));
      }
    }
    return new WordTypeContent(content.name, content.forms, links, wordTypeUnits);
  }
}
