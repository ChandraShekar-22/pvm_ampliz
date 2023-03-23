import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagingNotCorrectComponent } from './imaging-not-correct.component';

describe('ImagingNotCorrectComponent', () => {
  let component: ImagingNotCorrectComponent;
  let fixture: ComponentFixture<ImagingNotCorrectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingNotCorrectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingNotCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
