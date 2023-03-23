import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingInvitesCardComponent } from './pending-invites-card.component';

describe('PendingInvitesCardComponent', () => {
  let component: PendingInvitesCardComponent;
  let fixture: ComponentFixture<PendingInvitesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingInvitesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvitesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
