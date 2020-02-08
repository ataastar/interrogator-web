import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GuessedWord } from 'src/app/models/guessed-word';
import { WordService } from 'src/app/services/word-service';
import { Word } from 'src/app/models/word';

@Component({
  selector: 'app-show-phrases',
  templateUrl: './show-phrases.component.html',
  styleUrls: ['./show-phrases.component.css']
})
export class ShowPhrasesComponent implements OnInit {

  words: GuessedWord[] = null;
  key: string;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.key = params.get('id');
    });
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
        return this.wordService.getWords(params.get('id'));
      })).subscribe(words => {
        this.words = this.convertToGuessed(words);
      });
  }

  private convertToGuessed(words: Word[]): GuessedWord[] {
    if (words == null) { return null; }
    let actualWords = new Array(words.length);
    let i = 0;
    for (let word of words) {
      actualWords[i] = this.clone(word);
      i++;
    }
    return actualWords;
  }

  private clone(source: Word): GuessedWord {
    let cloned = new GuessedWord();
    // tslint:disable-next-line:forin
    for (let prop in source) {
      cloned[prop] = source[prop];
    }
    // convert the from and to arrays to string
    cloned.from = "";
    for (const phrase of source.from) {
      cloned.from = cloned.from + ";" + phrase.phrase;
    }
    cloned.from = cloned.from.substr(1);
    cloned.to = new Array(source.to.length);
    let i = 0;
    for (const phrase of source.to) {
      cloned.to[i] = phrase.phrase;
      i++;
    }
    return cloned;
  }

  interrogate(): void {
    this.router.navigate(['/interrogator', this.key]);
  }

  interrogateHere(): void {

  }

  addNew(): void {
    this.router.navigate(['/admin/addUnitContent', this.key]);
  }

}
