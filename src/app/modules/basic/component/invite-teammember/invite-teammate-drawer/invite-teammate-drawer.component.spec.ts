import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InviteTeammateDrawerComponent } from './invite-teammate-drawer.component';

describe('InviteTeammateDrawerComponent', () => {
  let component: InviteTeammateDrawerComponent;
  let fixture: ComponentFixture<InviteTeammateDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteTeammateDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteTeammateDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
