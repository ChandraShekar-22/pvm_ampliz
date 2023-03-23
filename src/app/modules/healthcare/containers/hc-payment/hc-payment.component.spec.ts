import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcPaymentComponent } from './hc-payment.component';

describe('HcPaymentComponent', () => {
  let component: HcPaymentComponent;
  let fixture: ComponentFixture<HcPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
