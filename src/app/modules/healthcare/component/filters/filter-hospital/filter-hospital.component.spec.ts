import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterHospitalComponent } from './filter-hospital.component';

describe('FilterHospitalComponent', () => {
  let component: FilterHospitalComponent;
  let fixture: ComponentFixture<FilterHospitalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterHospitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
