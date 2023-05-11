import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowCreditAlertCardComponent } from './low-credit-alert-card.component';

describe('LowCreditAlertCardComponent', () => {
  let component: LowCreditAlertCardComponent;
  let fixture: ComponentFixture<LowCreditAlertCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowCreditAlertCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowCreditAlertCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
