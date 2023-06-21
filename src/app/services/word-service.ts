import { Injectable } from '@angular/core';
import { Word } from '../models/word';
import { TranslationToSave } from '../models/translation-to-save';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Group } from '../models/group';
import {
  ReqAddAnswer,
  ResWordTypeTranslation,
  ResWordTypeTranslationRowsInner,
  ResWordTypeUnitTranslation,
  TranslationService,
  UnitLeaf,
  WordTypeService,
  WordTypeUnit
} from '@ataastar/interrogator-api-ts-oa';
import { Observable } from 'rxjs';
import InterrogationTypeEnum = ReqAddAnswer.InterrogationTypeEnum;

@Injectable()
export class WordService {

  // cache for later use
  private actualPhrases: Word[];
  private selectedUnitName: string;

  constructor(private http: HttpClient, private translationService: TranslationService, private wordTypeService: WordTypeService) {
  }

  async getWords(key: string) {
    try {
      const res = await this.http.get<object>(env.apiUrl + '/word/' + key)
        .toPromise();
      const json = res != null ? res : null;
      const unit = json != null ? (json[0].content != null ? json[0].content : json[0]) : null;
      this.actualPhrases = unit != null ? unit.words : null;
      this.selectedUnitName = unit != null ? unit.name : '';
      return this.actualPhrases;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async getTranslationForUnit(code: string) {
    try {
      const res = await this.http.get<object>(env.apiUrl + '/translation/' + code)
        .toPromise();
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

  getActualWords(): Word[] {
    return this.actualPhrases;
  }

  getSelectedUnitName(): string {
    return this.selectedUnitName;
  }

  async getGroups(): Promise<Group[]> {
    try {
      const res = await this.http.get<object>(env.apiUrl + '/units').toPromise();
      return res[0].groups;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async addUnitContent(translation: TranslationToSave) {
    try {
      const res = await this.http.post<any>(env.apiUrl + '/word/', translation).toPromise();
      return res.unitContentId;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async removeUnitContent(unitContentId: number) {
      return await this.http.delete(env.apiUrl + '/word/' + unitContentId).toPromise();
  }

  /*async activateWordTypeLink(linkId: number) {
    try {
      return await this.http.post(env.apiUrl + '/word_type/activate/' + linkId, {}).toPromise();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async deactivateWordTypeLink(linkId: number) {
    try {
      return await this.http.post(env.apiUrl + '/word_type/deactivate/' + linkId, {}).toPromise();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }*/

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

  async wrongAnswer(id: number, type: InterrogationTypeEnum): Promise<object> {
    return this.sendAnswer(id, false, type);
  }

  async rightAnswer(id: number, type: InterrogationTypeEnum): Promise<object> {
    return this.sendAnswer(id, true, type);
  }

  async sendAnswer(id: number, right: boolean, type: InterrogationTypeEnum): Promise<object> {
    try {
      return await this.translationService.storeAnswer({
        unitContentId: id,
        right: right,
        interrogationType: type
      }).toPromise();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }
}
