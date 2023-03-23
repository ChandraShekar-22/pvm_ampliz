import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterPhysicianComponent } from './filter-physician.component';

describe('FilterPhysicianComponent', () => {
  let component: FilterPhysicianComponent;
  let fixture: ComponentFixture<FilterPhysicianComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPhysicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
