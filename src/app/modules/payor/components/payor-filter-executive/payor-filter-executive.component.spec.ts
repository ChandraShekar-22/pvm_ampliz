import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorFilterExecutiveComponent } from './payor-filter-executive.component';

describe('PayorFilterExecutiveComponent', () => {
  let component: PayorFilterExecutiveComponent;
  let fixture: ComponentFixture<PayorFilterExecutiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorFilterExecutiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorFilterExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
