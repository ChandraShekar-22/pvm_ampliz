import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiFilterDropDownComponent } from './npi-filter-drop-down.component';

describe('NpiFilterDropDownComponent', () => {
  let component: NpiFilterDropDownComponent;
  let fixture: ComponentFixture<NpiFilterDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiFilterDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiFilterDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
