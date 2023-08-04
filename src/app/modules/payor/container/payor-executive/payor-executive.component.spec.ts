import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorExecutiveComponent } from './payor-executive.component';

describe('PayorExecutiveComponent', () => {
  let component: PayorExecutiveComponent;
  let fixture: ComponentFixture<PayorExecutiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorExecutiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
