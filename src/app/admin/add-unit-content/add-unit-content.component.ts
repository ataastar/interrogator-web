import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, OnDestroy } from '@angular/core';
import { Word } from 'src/app/models/word';
import { WordService } from 'src/app/services/word-service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Phrase } from 'src/app/models/phrase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-unit-content',
  templateUrl: './add-unit-content.component.html',
  styleUrls: ['./add-unit-content.component.css']
})
export class AddUnitContentComponent implements OnInit, AfterViewInit, OnDestroy {

  // for focus to the last created input
  @ViewChildren('froms') froms: QueryList<any>;
  private fromSub:Subscription = new Subscription();

  unitWords: Word[];
  fromPhrases: any[] = [{ value: '' }];
  toPhrases: any[] = [{ value: '' }];
  example: String;
  translatedExample: String;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.unitWords = this.wordService.getActualWords();
    if (!this.unitWords) {
      this.route.paramMap.pipe(switchMap((params: ParamMap) => {
        return this.wordService.getWords(params.get('id'));
      })).subscribe(words => {
        this.unitWords = words;
      });
    }
  }

  ngAfterViewInit() {
    console.log(this.froms);
   }
 
   //memory leak avoidance
   ngOnDestroy(){
     this.fromSub.unsubscribe();
   }

  public toString(phraseArray: Phrase[]): String {
    let result = "";
    for (const phrase of phraseArray) {
      result = result + ";" + phrase.phrase;
    }
    result = result.substr(1);
    return result;
  }

  addFrom() {
    this.fromPhrases.push({ value: '' });
    
  }

  addTo() {
    this.toPhrases.push({ value: '' });
  }

  add(): void {
    console.log(this.fromPhrases, this.toPhrases, this.example, this.translatedExample);
  }

}
