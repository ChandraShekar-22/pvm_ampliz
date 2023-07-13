import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMemberLimitComponent } from './no-member-limit.component';

describe('NoMemberLimitComponent', () => {
  let component: NoMemberLimitComponent;
  let fixture: ComponentFixture<NoMemberLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoMemberLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoMemberLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
