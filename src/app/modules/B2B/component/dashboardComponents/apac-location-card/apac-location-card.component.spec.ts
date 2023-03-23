import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApacLocationCardComponent } from './apac-location-card.component';

describe('ApacLocationCardComponent', () => {
  let component: ApacLocationCardComponent;
  let fixture: ComponentFixture<ApacLocationCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApacLocationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApacLocationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
