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
  fromPhrases: TranslationPart[] = [{ phrase: '', translationId: null }];
  toPhrases: TranslationPart[] = [{ phrase: '', translationId: null }];
  example: string;
  translatedExample: string;
  fromLanguageId: number;
  toLanguageId: number;

  translationToEdit: Translation;

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

  public toString(translation: Translation, languageId: number): string {
    let result = '';
    for (const translationPart of translation.phrasesByLanguageId[languageId]) {
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

  addOrEditTranslation(): void {
    if (this.translationToEdit != null) {
      this.saveEditedTranslation();
    } else {
      this.add();
    }
  }

  private add(): void {
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

    this.wordService.addUnitContent(translation).subscribe(translation => {
      if (translation) {
        this.unitTranslations.push(translation);
        this.clearTheInputs();
      }
    });
  }

  edit(translationToEdit: Translation): void {
    this.fromPhrases = translationToEdit.phrasesByLanguageId[this.fromLanguageId];
    this.toPhrases = translationToEdit.phrasesByLanguageId[this.toLanguageId];
    this.translationToEdit = translationToEdit;
    this.translatedExample = translationToEdit.translatedExample;
    this.example = translationToEdit.example;
  }

  private saveEditedTranslation(): void {
    this.wordService.updateTranslation(this.translationToEdit).subscribe(translation => {
      if (translation) {
        //this.unitTranslations.push(translation); TODO find and update
        this.clearTheInputs();
        this.translationToEdit = null;
      }
    });
  }

  private clearTheInputs(): void {
    this.fromPhrases = [{ phrase: '', translationId: null }];
    this.toPhrases = [{ phrase: '', translationId: null }];
    this.example = '';
    this.translatedExample = '';
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

  public addTranslation(): boolean {
    return this.translationToEdit == null;
  }

  public deleteTranslationPartTo(index: number) {
    this.translationToEdit.phrasesByLanguageId[this.toLanguageId].splice(index, 1);
  }

  public deleteTranslationPartFrom(index: number) {
    this.translationToEdit.phrasesByLanguageId[this.fromLanguageId].splice(index, 1);
  }
}
