import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeniorityCardComponent } from './seniority-card.component';

describe('SeniorityCardComponent', () => {
  let component: SeniorityCardComponent;
  let fixture: ComponentFixture<SeniorityCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeniorityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeniorityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
