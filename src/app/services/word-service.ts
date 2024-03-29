import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  ReqAddAnswer,
  ReqTranslationSave,
  ResTranslationsForUnit,
  ResWordTypeTranslation,
  ResWordTypeTranslationRowsInner,
  ResWordTypeUnitTranslation,
  TranslationService,
  UnitGroup,
  UnitLeaf,
  UnitService,
  WordTypeService,
  WordTypeUnit
} from '@ataastar/interrogator-api-ts-oa';
import { Observable } from 'rxjs';
import { Translation } from '@ataastar/interrogator-api-ts-oa/model/translation';
import InterrogationTypeEnum = ReqAddAnswer.InterrogationTypeEnum;

@Injectable()
export class WordService {

  // cache for later use
  private actualPhrases: Translation[];
  private selectedUnitName: string;
  fromLanguageId = 1;
  toLanguageId = 2;

  constructor(private http: HttpClient, private translationService: TranslationService, private wordTypeService: WordTypeService, private unitService: UnitService) {
  }

  getWords(key: string): Observable<ResTranslationsForUnit> {
    try {
      return this.translationService.getUnitTranslations(Number(key));
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  setTranslations(translationsForUnit: ResTranslationsForUnit): void {
    if (translationsForUnit) {
      this.actualPhrases = translationsForUnit.translations;
      this.selectedUnitName = translationsForUnit.name;
    } else {
      this.selectedUnitName = '';
    }
  }


  async getTranslationForUnit(code: string) {
    try {
      const res = await this.http.get<object>(env.apiUrl + '/translation/' + code).toPromise();
      const json = res != null ? res : null;
      const unit = json != null ? (json[0].content != null ? json[0].content : json[0]) : null;
      this.actualPhrases = unit != null ? unit.translations : null;
      this.selectedUnitName = unit != null ? unit.name : '';
      return this.actualPhrases;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  getActualWords(): Translation[] {
    return this.actualPhrases;
  }

  getSelectedUnitName(): string {
    return this.selectedUnitName;
  }

  getGroups(): Observable<UnitGroup[]> {
    try {
      return this.unitService.unitTree();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  addUnitContent(translationSave: ReqTranslationSave): Observable<Translation> {
    try {
      return this.translationService.addTranslation(translationSave);
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  updateTranslation(translation: Translation): Observable<Translation> {
    try {
      return this.translationService.updateTranslation(translation);
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  removeUnitContent(unitContentId: number): Observable<any> {
    return this.translationService.deleteUnitContent(unitContentId);
  }

  getWordTypeContent(wordTypeId: number, fromLanguageId: number, toLanguageId: number): Observable<ResWordTypeTranslation> {
    try {
      return this.wordTypeService.getWordTypeTranslations(wordTypeId, fromLanguageId, toLanguageId);
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  getWordTypeUnitContent(wordTypeUnitId: number, fromLanguageId: number): Observable<ResWordTypeUnitTranslation> {
    try {
      return this.wordTypeService.getWordTypeUnitTranslations(wordTypeUnitId, fromLanguageId);
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  getWordTypeUnits(): Observable<UnitLeaf[]> {
    try {
      return this.wordTypeService.getWordTypeUnits();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }


  addWordTypeUnitLink(link: ResWordTypeTranslationRowsInner, unit: WordTypeUnit): Observable<any> {
    try {
      return this.wordTypeService.addWordTypeUnitLink({ wordTypeUnitId: unit.id, wordTypeLinkId: link.id });
    } catch (onRejected) {
      console.error(onRejected);
      return;
    }
  }

  deleteWordTypeUnitLink(link: ResWordTypeTranslationRowsInner, unit: WordTypeUnit): Observable<any> {
    try {
      return this.wordTypeService.deleteWordTypeUnitLink(unit.id, link.id)
    } catch (onRejected) {
      console.error(onRejected);
      return;
    }
  }

  wrongAnswer(id: number, type: InterrogationTypeEnum, fromLanguageId: number): Observable<any> {
    return this.sendAnswer(id, false, type, fromLanguageId);
  }

  rightAnswer(id: number, type: InterrogationTypeEnum, fromLanguageId: number): Observable<any> {
    return this.sendAnswer(id, true, type, fromLanguageId);
  }

  sendAnswer(id: number, right: boolean, type: InterrogationTypeEnum, fromLanguageId: number): Observable<any> {
    try {
      return this.translationService.storeAnswer({
        unitContentId: id,
        right: right,
        interrogationType: type,
        fromLanguageId: fromLanguageId
      });
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  cancelAnswer(id: number, right: boolean, type: InterrogationTypeEnum, fromLanguageId: number): Observable<any> {
    try {
      return this.translationService.cancelAnswer({
        unitContentId: id,
        right: right,
        interrogationType: type,
        fromLanguageId: fromLanguageId
      });
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

}
