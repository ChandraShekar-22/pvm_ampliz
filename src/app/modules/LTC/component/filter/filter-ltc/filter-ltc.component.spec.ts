import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterLtcComponent } from './filter-ltc.component';

describe('FilterLtcComponent', () => {
  let component: FilterLtcComponent;
  let fixture: ComponentFixture<FilterLtcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterLtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
