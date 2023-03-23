import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RevenueCardComponent } from './revenue-card.component';

describe('RevenueCardComponent', () => {
  let component: RevenueCardComponent;
  let fixture: ComponentFixture<RevenueCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
