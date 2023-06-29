import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsSummaryComponent } from './credit-summary.component';

describe('ConsumedCreditsComponent', () => {
  let component: CreditsSummaryComponent;
  let fixture: ComponentFixture<CreditsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditsSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
