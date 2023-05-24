import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiCustomDataComponent } from './npi-custom-data.component';

describe('NpiCustomDataComponent', () => {
  let component: NpiCustomDataComponent;
  let fixture: ComponentFixture<NpiCustomDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiCustomDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiCustomDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
