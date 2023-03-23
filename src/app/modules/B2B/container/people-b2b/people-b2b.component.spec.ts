import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeopleB2bComponent } from './people-b2b.component';

describe('PeopleB2bComponent', () => {
  let component: PeopleB2bComponent;
  let fixture: ComponentFixture<PeopleB2bComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleB2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
