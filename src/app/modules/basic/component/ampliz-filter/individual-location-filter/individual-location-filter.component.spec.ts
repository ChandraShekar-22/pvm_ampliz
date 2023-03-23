import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndividualLocationFilterComponent } from './individual-location-filter.component';

describe('IndividualLocationFilterComponent', () => {
  let component: IndividualLocationFilterComponent;
  let fixture: ComponentFixture<IndividualLocationFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualLocationFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLocationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
