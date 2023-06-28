import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberSignupComponent } from './team-member-signup.component';

describe('TeamMemberSignupComponent', () => {
  let component: TeamMemberSignupComponent;
  let fixture: ComponentFixture<TeamMemberSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemberSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMemberSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
