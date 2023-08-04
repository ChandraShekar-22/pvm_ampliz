import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayourExecutiveOverviewComponent } from './payour-executive-overview.component';

describe('PayourExecutiveOverviewComponent', () => {
  let component: PayourExecutiveOverviewComponent;
  let fixture: ComponentFixture<PayourExecutiveOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayourExecutiveOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayourExecutiveOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
