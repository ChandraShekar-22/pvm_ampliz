import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSidePanelComponent } from './member-side-panel.component';

describe('MemberSidePanelComponent', () => {
  let component: MemberSidePanelComponent;
  let fixture: ComponentFixture<MemberSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberSidePanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
