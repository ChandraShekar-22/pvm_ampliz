import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberActionPanelComponent } from './member-action-panel.component';

describe('MemberActionPanelComponent', () => {
  let component: MemberActionPanelComponent;
  let fixture: ComponentFixture<MemberActionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberActionPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
