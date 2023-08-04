import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorCardComponent } from './payor-card.component';

describe('PayorCardComponent', () => {
  let component: PayorCardComponent;
  let fixture: ComponentFixture<PayorCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
