import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagingCenterCardComponent } from './imaging-center-card.component';

describe('ImagingCenterCardComponent', () => {
  let component: ImagingCenterCardComponent;
  let fixture: ComponentFixture<ImagingCenterCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingCenterCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingCenterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
