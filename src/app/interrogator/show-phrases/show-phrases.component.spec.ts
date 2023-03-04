import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowPhrasesComponent } from './show-phrases.component';
import { WordService } from '../../services/word-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ShowPhrasesComponent', () => {
  let component: ShowPhrasesComponent;
  let fixture: ComponentFixture<ShowPhrasesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: WordService}, {provide: ActivatedRoute,  useValue: { paramMap: new Subject() } } ],
      declarations: [ ShowPhrasesComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPhrasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
