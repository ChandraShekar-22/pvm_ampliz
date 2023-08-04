import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayourCompanyOverviewComponent } from './payour-company-overview.component';

describe('PayourCompanyOverviewComponent', () => {
  let component: PayourCompanyOverviewComponent;
  let fixture: ComponentFixture<PayourCompanyOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayourCompanyOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayourCompanyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
