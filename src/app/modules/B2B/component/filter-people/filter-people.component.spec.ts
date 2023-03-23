import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterPeopleComponent } from './filter-people.component';

describe('FilterPeopleComponent', () => {
  let component: FilterPeopleComponent;
  let fixture: ComponentFixture<FilterPeopleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
