import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicianOverviewComponent } from './physician-overview.component';

describe('PhysicianOverviewComponent', () => {
  let component: PhysicianOverviewComponent;
  let fixture: ComponentFixture<PhysicianOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
