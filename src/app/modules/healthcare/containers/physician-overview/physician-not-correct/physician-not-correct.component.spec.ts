import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianNotCorrectComponent } from './physician-not-correct.component';

describe('PhysicianNotCorrectComponent', () => {
  let component: PhysicianNotCorrectComponent;
  let fixture: ComponentFixture<PhysicianNotCorrectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicianNotCorrectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicianNotCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
