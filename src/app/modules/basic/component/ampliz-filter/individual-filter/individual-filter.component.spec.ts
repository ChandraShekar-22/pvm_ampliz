import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndividualFilterComponent } from './individual-filter.component';

describe('IndividualFilterComponent', () => {
  let component: IndividualFilterComponent;
  let fixture: ComponentFixture<IndividualFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
