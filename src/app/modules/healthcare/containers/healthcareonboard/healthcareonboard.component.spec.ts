import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HealthcareonboardComponent } from './healthcareonboard.component';

describe('HealthcareonboardComponent', () => {
  let component: HealthcareonboardComponent;
  let fixture: ComponentFixture<HealthcareonboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthcareonboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthcareonboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
