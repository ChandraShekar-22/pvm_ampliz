import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonCardComponent } from './common-card.component';

describe('CommonCardComponent', () => {
  let component: CommonCardComponent;
  let fixture: ComponentFixture<CommonCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
