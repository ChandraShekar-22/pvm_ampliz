import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApacCompaniesComponent } from './apac-companies.component';

describe('ApacCompaniesComponent', () => {
  let component: ApacCompaniesComponent;
  let fixture: ComponentFixture<ApacCompaniesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApacCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApacCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
