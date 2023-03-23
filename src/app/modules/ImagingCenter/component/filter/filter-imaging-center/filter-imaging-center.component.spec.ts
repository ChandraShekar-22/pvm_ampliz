import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterImagingCenterComponent } from './filter-imaging-center.component';

describe('FilterImagingCenterComponent', () => {
  let component: FilterImagingCenterComponent;
  let fixture: ComponentFixture<FilterImagingCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterImagingCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterImagingCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
