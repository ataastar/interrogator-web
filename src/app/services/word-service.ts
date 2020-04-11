import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Word } from '../models/word';
import { TranslationToSave } from '../models/translation-to-save';
import { environment as env } from 'src/environments/environment';

@Injectable()
export class WordService {
    
    // cache for later use
    actualPhrases: Word[];

    constructor(private http: Http) { }

    async getWords(key: String) {
        try {
            const res = await this.http.get(env.apiUrl + '/words/' + key)
                .toPromise();
            var json = res != null ? res.json() : null;
            var unit = json != null ? (json[0].content != null ? json[0].content : json[0]) : null;
            this.actualPhrases = unit != null ? unit.words : null;
            return this.actualPhrases;
        }
        catch (onrejected) {
            console.error(onrejected);
            return null;
        }
    }

    getActualWords(): Word[] {
        return this.actualPhrases;
    }

    async getGroups() {
        try {
            const res = await this.http.get(env.apiUrl + '/word_groups').toPromise();
            return res.json()[0].groups;
        }
        catch (onrejected) {
            console.error(onrejected);
            return null;
        }
    }

    async addUnitContent(translation: TranslationToSave) {
        try {
            const res = await this.http.put(env.apiUrl + '/word/', translation).toPromise();
            return res.json().unitContentId;
        }
        catch (onrejected) {
            console.error(onrejected);
            return null;
        }
    }

    async removeUnitContent(unitContentId: number) {
        try {
            let body = { unitContentId: (unitContentId) };
            return await this.http.put(env.apiUrl + '/word/remove', body).toPromise();
        }
        catch (onrejected) {
            console.error(onrejected);
            return null;
        }
    }
}
