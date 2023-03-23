import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcpricingComponent } from './hcpricing.component';

describe('HcpricingComponent', () => {
  let component: HcpricingComponent;
  let fixture: ComponentFixture<HcpricingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcpricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcpricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
