import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Word } from '../models/word';
import { TranslationToSave } from '../models/translation-to-save';

@Injectable()
export class WordService {

    actualPhrases: Word[];

    constructor(private http: Http) { }

    async getWords(key: String) {
        try {
            const res = await this.http.get('http://localhost:3000/words/' + key)
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
            const res = await this.http.get('http://localhost:3000/word_groups').toPromise();
            return res.json()[0].groups;
        }
        catch (onrejected) {
            console.error(onrejected);
            return null;
        }
    }

    async addUnitContent(translation: TranslationToSave) {
        try {
            const res = await this.http.put('http://localhost:3000/word/', translation).toPromise();
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
            return await this.http.put('http://localhost:3000/word/remove', body).toPromise();
        }
        catch (onrejected) {
            console.error(onrejected);
            return null;
        }
    }
}
