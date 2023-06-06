import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiCriteriaComponent } from './npi-criteria.component';

describe('NpiCriteriaComponent', () => {
  let component: NpiCriteriaComponent;
  let fixture: ComponentFixture<NpiCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
