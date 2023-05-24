import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiDataCardComponent } from './npi-data-card.component';

describe('NpiDataCardComponent', () => {
  let component: NpiDataCardComponent;
  let fixture: ComponentFixture<NpiDataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpiDataCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpiDataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
