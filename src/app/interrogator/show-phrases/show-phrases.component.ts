import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GuessedWord } from 'src/app/models/guessed-word';
import { WordService } from 'src/app/services/word-service';
import { GuessedWordConverter } from '../guessed-word-converter';

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
        this.words = new GuessedWordConverter().convertToGuessed(words);
      });
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
