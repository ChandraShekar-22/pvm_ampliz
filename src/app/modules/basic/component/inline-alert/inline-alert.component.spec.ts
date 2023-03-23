import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InlineAlertComponent } from './inline-alert.component';

describe('InlineAlertComponent', () => {
  let component: InlineAlertComponent;
  let fixture: ComponentFixture<InlineAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
