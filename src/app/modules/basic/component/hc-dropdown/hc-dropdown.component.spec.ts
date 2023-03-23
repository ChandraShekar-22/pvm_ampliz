import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcDropdownComponent } from './hc-dropdown.component';

describe('HcDropdownComponent', () => {
  let component: HcDropdownComponent;
  let fixture: ComponentFixture<HcDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
