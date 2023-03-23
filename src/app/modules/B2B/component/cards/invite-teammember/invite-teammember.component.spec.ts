import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InviteTeammemberComponent } from './invite-teammember.component';

describe('InviteTeammemberComponent', () => {
  let component: InviteTeammemberComponent;
  let fixture: ComponentFixture<InviteTeammemberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteTeammemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteTeammemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
