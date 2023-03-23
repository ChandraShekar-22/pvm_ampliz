import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagingCenterExecutiveComponent } from './imaging-center-executive.component';

describe('ImagingCenterComponent', () => {
  let component: ImagingCenterExecutiveComponent;
  let fixture: ComponentFixture<ImagingCenterExecutiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingCenterExecutiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingCenterExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
