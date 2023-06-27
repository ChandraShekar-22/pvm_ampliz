
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianImageCardComponent } from './physician-image-card.component';

describe('PhysicianImageCardComponent', () => {
  let component: PhysicianImageCardComponent;
  let fixture: ComponentFixture<PhysicianImageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicianImageCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicianImageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
