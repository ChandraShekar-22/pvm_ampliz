import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorCompanyComponent } from './payor-company.component';

describe('PayorCompanyComponent', () => {
  let component: PayorCompanyComponent;
  let fixture: ComponentFixture<PayorCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
