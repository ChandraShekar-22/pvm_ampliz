import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorCenterCardComponent } from './payor-center-card.component';

describe('PayorCenterCardComponent', () => {
  let component: PayorCenterCardComponent;
  let fixture: ComponentFixture<PayorCenterCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorCenterCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorCenterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
