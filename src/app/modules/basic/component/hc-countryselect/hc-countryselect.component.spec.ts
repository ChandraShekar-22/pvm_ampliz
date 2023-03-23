import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcCountryselectComponent } from './hc-countryselect.component';

describe('HcCountryselectComponent', () => {
  let component: HcCountryselectComponent;
  let fixture: ComponentFixture<HcCountryselectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcCountryselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcCountryselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
