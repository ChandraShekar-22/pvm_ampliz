import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiListComponent } from './npi-list.component';

describe('NpiListComponent', () => {
  let component: NpiListComponent;
  let fixture: ComponentFixture<NpiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
