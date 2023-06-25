import { Component, OnInit } from '@angular/core';
import { WordService } from 'src/app/services/word-service';
import { ActivatedRoute } from '@angular/router';
import { Translation } from '@ataastar/interrogator-api-ts-oa/model/translation';
import { ReqTranslationSave, TranslationPart } from '@ataastar/interrogator-api-ts-oa';

@Component({
  selector: 'app-add-unit-content',
  templateUrl: './add-unit-content.component.html',
  styleUrls: ['./add-unit-content.component.css']
})
export class AddUnitContentComponent implements OnInit {

  unitId: string;
  unitTranslations: Translation[];
  fromPhrases: TranslationPart[] = [];
  toPhrases: TranslationPart[] = [];
  example: string;
  translatedExample: string;
  fromLanguageId: number;
  toLanguageId: number;

  constructor(private wordService: WordService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.fromLanguageId = this.wordService.fromLanguageId;
    this.toLanguageId = this.wordService.toLanguageId
    this.unitTranslations = this.wordService.getActualWords();
    this.route.paramMap.subscribe((params) => {
      this.unitId = params.get('id');
      if (!this.unitTranslations) {
        this.wordService.getWords(this.unitId).subscribe(translationsForUnit => {
          if (translationsForUnit != null) {
            this.unitTranslations = translationsForUnit.translations;
          } else {
            this.unitTranslations = new Array(0);
          }
        });
      }
    });
  }

  public toString(phraseArray: TranslationPart[]): string {
    let result = '';
    for (const translationPart of phraseArray) {
      result = result + ';' + translationPart.phrase;
    }
    result = result.substring(1);
    return result;
  }

  addFrom() {
    this.fromPhrases.push({ translationId: null, phrase: '' });
  }

  addTo() {
    this.toPhrases.push({ translationId: null, phrase: '' });
  }

  add(): void {
    if (!this.isPhrasesFilled(this.fromPhrases) || !this.isPhrasesFilled(this.toPhrases)) {
      return;
    }

    const translation: ReqTranslationSave = {
      id: Number(this.unitId),
      from: this.getPhraseStrings(this.fromPhrases),
      to: this.getPhraseStrings(this.toPhrases),
      example: this.example,
      translatedExample: this.translatedExample
    };

    this.wordService.addUnitContent(translation).subscribe(unitContentId => {
      if (unitContentId) {
        const phrasesByLanguageId: { [p: string]: TranslationPart[] } = {};
        phrasesByLanguageId[this.fromLanguageId] = this.fromPhrases;
        phrasesByLanguageId[this.toLanguageId] = this.toPhrases;
        const translation: Translation = {
          unitContentId: unitContentId,
          example: this.example,
          translatedExample: this.translatedExample,
          translationLinkId: null, // TODO translation link
          phrasesByLanguageId: phrasesByLanguageId
        };
        this.unitTranslations.push(translation);
        // clear the inputs
        this.fromPhrases = [];
        this.toPhrases = [];
        this.example = '';
        this.translatedExample = '';
      }
    });
  }

  edit(translationToEdit: Translation): void {

  }

  remove(translationToRemove: Translation): void {
    this.wordService.removeUnitContent(translationToRemove.unitContentId).subscribe(() => {
      const index = this.unitTranslations.indexOf(translationToRemove, 0);
      if (index > -1) {
        this.unitTranslations.splice(index, 1);
      }
    }, error => alert(error));
    return;
  }

  getUnitName(): string {
    return this.wordService.getSelectedUnitName();
  }

  private getPhraseStrings(translationParts: TranslationPart[]): string[] {
    const strings: string[] = [];
    translationParts.forEach(translationPart => {
      strings.push(translationPart.phrase);
    });
    return strings;
  }

  private isPhrasesFilled(translationParts: TranslationPart[]): boolean {
    let result = true;
    translationParts.forEach(translationPart => {
      if (translationPart === undefined || translationPart == null) {
        result = false;
        return;
      } else if (translationPart.phrase == undefined || translationPart.phrase.trim() == '') {
        result = false;
        return;
      }
    });
    return result;
  }

}
