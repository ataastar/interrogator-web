import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/models/word';
import { WordService } from 'src/app/services/word-service';
import { ActivatedRoute } from '@angular/router';
import { Phrase } from 'src/app/models/phrase';
import { TranslationToSave } from 'src/app/models/translation-to-save';

@Component({
  selector: 'app-add-unit-content',
  templateUrl: './add-unit-content.component.html',
  styleUrls: ['./add-unit-content.component.css']
})
export class AddUnitContentComponent implements OnInit {

  unitId: string;
  unitWords: Word[];
  fromPhrases: Phrase[] = [new Phrase('')];
  toPhrases: Phrase[] = [new Phrase('')];
  example: string;
  translatedExample: string;

  constructor(private wordService: WordService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.unitWords = this.wordService.getActualWords();
    if (!this.unitWords) {
      this.route.paramMap.subscribe((params) => {
        this.unitId = params.get('id');
        this.wordService.getWords(this.unitId).then(words => {
          if (words != null) {
            this.unitWords = words;
          } else {
            this.unitWords = new Array(0);
          }
        })
      });
    } else {
      this.route.paramMap.subscribe((params) => {
        this.unitId = params.get('id');
      })
    }
  }

  public toString(phraseArray: Phrase[]): string {
    let result = '';
    for (const phrase of phraseArray) {
      result = result + ';' + phrase.phrase;
    }
    result = result.substr(1);
    return result;
  }

  addFrom() {
    this.fromPhrases.push(new Phrase(''));
  }

  addTo() {
    this.toPhrases.push(new Phrase(''));
  }

  add(): void {
    if (!this.isPhrasesFilled(this.fromPhrases) || !this.isPhrasesFilled(this.toPhrases)) {
      return;
    }

    const translation = new TranslationToSave(this.unitId, this.getPhraseStrings(this.fromPhrases),
      this.getPhraseStrings(this.toPhrases), this.example, this.translatedExample);

    this.wordService.addUnitContent(translation).then(unitContentId => {
      if (unitContentId) {
        const word = new Word(unitContentId, this.fromPhrases, this.toPhrases, this.example, this.translatedExample);
        this.unitWords.push(word);
        // clear the inputs
        this.fromPhrases = [new Phrase('')];
        this.toPhrases = [new Phrase('')];
        this.example = '';
        this.translatedExample = '';
      }
    });
  }

  edit(wordToEdit: Word): void {

  }

  remove(wordToRemove: Word): void {
    this.wordService.removeUnitContent(wordToRemove.id).then(() => {
      const index = this.unitWords.indexOf(wordToRemove, 0);
      if (index > -1) {
        this.unitWords.splice(index, 1);
      }
    }, error => alert(error));
    return;
  }

  getUnitName(): string {
    return this.wordService.getSelectedUnitName();
  }

  private getPhraseStrings(phrases: Phrase[]): string[] {
    const strings: string[] = [];
    phrases.forEach(phrase => {
      strings.push(phrase.phrase);
    });
    return strings;
  }

  private isPhrasesFilled(phrases: Phrase[]): boolean {
    let result = true;
    phrases.forEach(phrase => {
      if (phrase === undefined || phrase == null) {
        result = false;
        return;
      } else if (phrase.phrase == undefined || phrase.phrase.trim() == '') {
        result = false;
        return;
      }
    });
    return result;
  }

}
