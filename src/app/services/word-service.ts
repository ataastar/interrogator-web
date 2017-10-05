import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { Word } from '../models/word';

@Injectable()
export class WordService {

    constructor(private http: Http) {}

    getWords(key: string) {
        return this.http.get('src/app/resources/data/words' + key + '.json')
                    .toPromise()
                    .then(res => <Word[]> res.json().data)
                    .then(data => { return data; });
    }
}
