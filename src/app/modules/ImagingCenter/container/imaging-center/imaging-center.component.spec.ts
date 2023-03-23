import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagingCenterComponent } from './imaging-center.component';

describe('ImagingCenterComponent', () => {
  let component: ImagingCenterComponent;
  let fixture: ComponentFixture<ImagingCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
