import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LtcCardComponent } from './ltc-card.component';

describe('LtcCardComponent', () => {
  let component: LtcCardComponent;
  let fixture: ComponentFixture<LtcCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LtcCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
