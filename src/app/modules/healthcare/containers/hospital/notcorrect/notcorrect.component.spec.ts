import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotcorrectHospitalComponent } from './notcorrect.component';

describe('NotcorrectComponent', () => {
  let component: NotcorrectHospitalComponent;
  let fixture: ComponentFixture<NotcorrectHospitalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotcorrectHospitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotcorrectHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
