import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorNotCorrectComponent } from './payor-not-correct.component';

describe('PayorNotCorrectComponent', () => {
  let component: PayorNotCorrectComponent;
  let fixture: ComponentFixture<PayorNotCorrectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorNotCorrectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorNotCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
