import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcdashboardComponent } from './hcdashboard.component';

describe('HcdashboardComponent', () => {
  let component: HcdashboardComponent;
  let fixture: ComponentFixture<HcdashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
