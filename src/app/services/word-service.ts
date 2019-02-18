import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Word } from '../models/word';

@Injectable()
export class WordService {

    constructor(private http: Http) { }

    getWords(key: string) {
        if (key != null) {
        return this.http.get('src/app/resources/data/words' + key + '.json')
            .toPromise()
            .then(res => <Word[]>res.json().data)
            .then(data => { return data; });
        } else {
            return [];
        }
    }

    getWords2(key: string) {
        return this.http.get('http://localhost:3000/words/' + key)
            .toPromise()
            .then(res => {
                var json = res != null ? res.json() : null;
                var unit = json != null ? json[0] : null;
                return unit != null ? unit.words : null;
            });
    }

    getGroups() {
        return this.http.get('http://localhost:3000/word_groups')
            .toPromise()
            .then(res => { return res.json(); });
    }
}
