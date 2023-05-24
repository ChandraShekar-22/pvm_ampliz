import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiDataProgressModalComponent } from './npi-data-progress-modal.component';

describe('NpiDataProgressModalComponent', () => {
  let component: NpiDataProgressModalComponent;
  let fixture: ComponentFixture<NpiDataProgressModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiDataProgressModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiDataProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
