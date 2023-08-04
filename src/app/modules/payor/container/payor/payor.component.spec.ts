import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorComponent } from './payor.component';

describe('PayorComponent', () => {
  let component: PayorComponent;
  let fixture: ComponentFixture<PayorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
