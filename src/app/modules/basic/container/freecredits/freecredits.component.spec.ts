import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecreditsComponent } from './freecredits.component';

describe('FreecreditsComponent', () => {
  let component: FreecreditsComponent;
  let fixture: ComponentFixture<FreecreditsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
