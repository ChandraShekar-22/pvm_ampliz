import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LowCreditCardComponent } from './low-credit-card.component';

describe('LowCreditCardComponent', () => {
  let component: LowCreditCardComponent;
  let fixture: ComponentFixture<LowCreditCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LowCreditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
