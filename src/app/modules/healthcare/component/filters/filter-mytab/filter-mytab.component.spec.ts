import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterMytabComponent } from './filter-mytab.component';

describe('FilterMytabComponent', () => {
  let component: FilterMytabComponent;
  let fixture: ComponentFixture<FilterMytabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterMytabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMytabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
