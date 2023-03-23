import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterImagingCenterExecutivesComponent } from './filter-imaging-center-executives.component';

describe('FilterImagingCenterExecutivesComponent', () => {
  let component: FilterImagingCenterExecutivesComponent;
  let fixture: ComponentFixture<FilterImagingCenterExecutivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterImagingCenterExecutivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterImagingCenterExecutivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
