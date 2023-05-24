import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaCardComponent } from './quota-card.component';

describe('QuotaCardComponent', () => {
  let component: QuotaCardComponent;
  let fixture: ComponentFixture<QuotaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
