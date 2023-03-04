import { Injectable } from '@angular/core';
import { Word } from '../models/word';
import { TranslationToSave } from '../models/translation-to-save';
import { environment as env } from 'src/environments/environment';
import { ToWordTypeContentMapper } from '../mapper/to-word-type-content-mapper';
import { WordTypeContent } from '../models/word-type/word-type-content';
import { WordTypeLink } from '../models/word-type/word-type-link';
import { WordTypeUnit } from '../models/word-type/word-type-unit';
import { HttpClient } from '@angular/common/http';
import { InterrogatorType } from '../interrogator/enum/interrogator-type';

@Injectable()
export class WordService {

  // cache for later use
  private actualPhrases: Word[];
  private selectedUnitName: string;

  constructor(private http: HttpClient) {
  }

  async getWords(key: string) {
    try {
      const res = await this.http.get<any>(env.apiUrl + '/words/' + key)
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

  getActualWords(): Word[] {
    return this.actualPhrases;
  }

  getSelectedUnitName(): string {
    return this.selectedUnitName;
  }

  async getGroups() {
    try {
      const res = await this.http.get<any>(env.apiUrl + '/word_groups').toPromise();
      return res[0].groups;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async addUnitContent(translation: TranslationToSave) {
    try {
      const res = await this.http.put<any>(env.apiUrl + '/word/', translation).toPromise();
      return res.unitContentId;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async removeUnitContent(unitContentId: number) {
    try {
      const body = {unitContentId: (unitContentId)};
      return await this.http.put(env.apiUrl + '/word/remove', body).toPromise();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
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

  async getWordTypeContent(wordTypeId: number, fromLanguageId: number, toLanguageId: number): Promise<WordTypeContent> {
    try {
      const body = {wordTypeId: wordTypeId, fromLanguageId: fromLanguageId, toLanguageId: toLanguageId};
      const res = await this.http.post<any>(env.apiUrl + '/word_type', body).toPromise();
      return ToWordTypeContentMapper.map(res[0].content);
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async getWordTypeUnitContent(wordTypeUnitId: number, fromLanguageId: number): Promise<WordTypeContent> {
    try {
      const res = await this.http.get<any>(env.apiUrl + '/word_type_unit/' + wordTypeUnitId + '/' + fromLanguageId).toPromise();
      return ToWordTypeContentMapper.map(res[0].content);
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }

  async getWordTypeUnits() {
    try {
      const res = await this.http.get<any>(env.apiUrl + '/word_type_unit').toPromise();
      return res[0].groups;
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }


  async addWordTypeUnitLink(link: WordTypeLink, unit: WordTypeUnit) {
    try {
      const request = {wordTypeUnitLinkId: unit.id, wordTypeLinkId: link.id};
      await this.http.put(env.apiUrl + '/word_type_unit_link/add/', request).toPromise();
      return;
    } catch (onRejected) {
      console.error(onRejected);
      return;
    }
  }

  async deleteWordTypeUnitLink(link: WordTypeLink, unit: WordTypeUnit) {
    try {
      const request = {wordTypeUnitLinkId: unit.id, wordTypeLinkId: link.id};
      await this.http.put(env.apiUrl + '/word_type_unit_link/delete/', request).toPromise();
      return;
    } catch (onRejected) {
      console.error(onRejected);
      return;
    }
  }

  async wrongAnswer(id: number, type: InterrogatorType): Promise<Object> {
    return this.sendAnswer(id, false, type);
  }

  async rightAnswer(id: number, type: InterrogatorType): Promise<Object> {
    return this.sendAnswer(id, true, type);
  }

  async sendAnswer(id: number, right: boolean, type: InterrogatorType): Promise<Object> {
    try {
      const request = {id: id, right: right, interrogation_type: type};
      return await this.http.post(env.apiUrl + '/answer', request).toPromise();
    } catch (onRejected) {
      console.error(onRejected);
      return null;
    }
  }
}
