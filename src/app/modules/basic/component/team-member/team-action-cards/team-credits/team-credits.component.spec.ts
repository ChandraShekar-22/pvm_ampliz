import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCreditsComponent } from './team-credits.component';

describe('TeamCreditsComponent', () => {
  let component: TeamCreditsComponent;
  let fixture: ComponentFixture<TeamCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamCreditsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
