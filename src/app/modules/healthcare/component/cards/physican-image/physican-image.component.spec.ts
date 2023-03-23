import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicanImageComponent } from './physican-image.component';

describe('PhysicanImageComponent', () => {
  let component: PhysicanImageComponent;
  let fixture: ComponentFixture<PhysicanImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicanImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicanImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
