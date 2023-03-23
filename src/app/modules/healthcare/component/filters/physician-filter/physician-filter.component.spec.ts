import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material';

import { PhysicianFilterComponent } from './physician-filter.component';

describe('PhysicianFilterComponent', () => {
  let component: PhysicianFilterComponent;
  let fixture: ComponentFixture<PhysicianFilterComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [ MatSelectModule ],
      declarations: [ PhysicianFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
