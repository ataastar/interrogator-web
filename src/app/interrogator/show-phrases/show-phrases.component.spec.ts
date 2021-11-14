import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowPhrasesComponent } from './show-phrases.component';

describe('ShowPhrasesComponent', () => {
  let component: ShowPhrasesComponent;
  let fixture: ComponentFixture<ShowPhrasesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPhrasesComponent ]
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
