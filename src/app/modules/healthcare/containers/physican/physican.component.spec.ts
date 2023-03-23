import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicanPageComponent } from './physican.component';

describe('PhysicanPageComponent', () => {
  let component: PhysicanPageComponent;
  let fixture: ComponentFixture<PhysicanPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicanPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
