import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChromeCardComponent } from './dashboard-chrome-card.component';

describe('DashboardChromeCardComponent', () => {
  let component: DashboardChromeCardComponent;
  let fixture: ComponentFixture<DashboardChromeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardChromeCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardChromeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
