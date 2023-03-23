import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagingCardComponent } from './imaging-card.component';

describe('ImagingCardComponent', () => {
  let component: ImagingCardComponent;
  let fixture: ComponentFixture<ImagingCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
