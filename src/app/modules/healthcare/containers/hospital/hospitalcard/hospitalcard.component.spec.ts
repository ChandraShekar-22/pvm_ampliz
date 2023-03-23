import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HospitalcardComponent } from './hospitalcard.component';

describe('HospitalcardComponent', () => {
  let component: HospitalcardComponent;
  let fixture: ComponentFixture<HospitalcardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
