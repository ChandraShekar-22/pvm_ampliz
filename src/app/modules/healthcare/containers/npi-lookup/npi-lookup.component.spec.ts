import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiLookupComponent } from './npi-lookup.component';

describe('NpiLookupComponent', () => {
  let component: NpiLookupComponent;
  let fixture: ComponentFixture<NpiLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpiLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpiLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
