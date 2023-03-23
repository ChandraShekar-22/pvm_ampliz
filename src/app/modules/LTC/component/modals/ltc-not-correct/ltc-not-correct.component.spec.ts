import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LtcNotCorrectComponent } from './ltc-not-correct.component';

describe('LtcNotCorrectComponent', () => {
  let component: LtcNotCorrectComponent;
  let fixture: ComponentFixture<LtcNotCorrectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LtcNotCorrectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcNotCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
