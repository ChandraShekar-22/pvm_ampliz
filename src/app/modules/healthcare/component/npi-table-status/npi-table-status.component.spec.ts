import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiTableStatusComponent } from './npi-table-status.component';

describe('NpiTableStatusComponent', () => {
  let component: NpiTableStatusComponent;
  let fixture: ComponentFixture<NpiTableStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiTableStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiTableStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
