import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcInputComponent } from './hc-input.component';

describe('HcInputComponent', () => {
  let component: HcInputComponent;
  let fixture: ComponentFixture<HcInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
