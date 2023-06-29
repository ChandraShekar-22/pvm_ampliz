import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditActionCardsComponent } from './credit-action-cards.component';

describe('CreditActionCardsComponent', () => {
  let component: CreditActionCardsComponent;
  let fixture: ComponentFixture<CreditActionCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditActionCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditActionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
