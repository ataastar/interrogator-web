import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddUnitContentComponent } from './add-unit-content.component';
import { WordService } from '../../services/word-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AddUnitContentComponent', () => {
  let component: AddUnitContentComponent;
  let fixture: ComponentFixture<AddUnitContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitContentComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [{provide: WordService}, {provide: ActivatedRoute,  useValue: { paramMap: new Subject() } } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
