import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExecutiveOverviewComponent } from './executive-overview.component';

describe('ExecutiveOverviewComponent', () => {
  let component: ExecutiveOverviewComponent;
  let fixture: ComponentFixture<ExecutiveOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
