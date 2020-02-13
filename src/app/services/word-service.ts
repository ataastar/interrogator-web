import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Word } from '../models/word';
import { TranslationToSave } from '../models/translation-to-save';

@Injectable()
export class WordService {

    actualPhrases: Word[];

    constructor(private http: Http) { }

    getWords(key: String) {
        return this.http.get('http://localhost:3000/words/' + key)
            .toPromise()
            .then(res => {
                var json = res != null ? res.json() : null;
                var unit = json != null ? (json[0].content != null ? json[0].content : json[0]) : null;
                this.actualPhrases = unit != null ? unit.words : null;
                return this.actualPhrases;
            });
    }

    getActualWords(): Word[] {
        return this.actualPhrases;
    }

    getGroups() {
        return this.http.get('http://localhost:3000/word_groups')
            .toPromise()
            .then(res => res.json()[0].groups);
    }

    addUnitContent(translation: TranslationToSave) {
        return this.http.put('http://localhost:3000/word/', translation).toPromise()
            .then(
                res => {
                    return;
                }
            ).catch(onrejected =>
                console.error(onrejected)
            )

    }
}
