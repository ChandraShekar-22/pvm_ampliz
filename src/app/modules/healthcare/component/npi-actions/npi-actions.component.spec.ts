import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiActionsComponent } from './npi-actions.component';

describe('NpiActionsComponent', () => {
  let component: NpiActionsComponent;
  let fixture: ComponentFixture<NpiActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
