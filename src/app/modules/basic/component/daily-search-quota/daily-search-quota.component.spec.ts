import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySearchQuotaComponent } from './daily-search-quota.component';

describe('DailySearchQuotaComponent', () => {
  let component: DailySearchQuotaComponent;
  let fixture: ComponentFixture<DailySearchQuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySearchQuotaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailySearchQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
