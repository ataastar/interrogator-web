import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddUnitContentComponent } from './add-unit-content.component';

describe('AddUnitContentComponent', () => {
  let component: AddUnitContentComponent;
  let fixture: ComponentFixture<AddUnitContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitContentComponent ]
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
