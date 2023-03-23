import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterExecutiveComponent } from './filter-executive.component';

describe('FilterExecutiveComponent', () => {
  let component: FilterExecutiveComponent;
  let fixture: ComponentFixture<FilterExecutiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterExecutiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
