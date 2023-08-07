import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsSelectionComponent } from './maps-selection.component';

describe('MapsSelectionComponent', () => {
  let component: MapsSelectionComponent;
  let fixture: ComponentFixture<MapsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
