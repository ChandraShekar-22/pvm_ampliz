import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HcTopTabComponent } from './hc-top-tab.component';

describe('HcTopTabComponent', () => {
  let component: HcTopTabComponent;
  let fixture: ComponentFixture<HcTopTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HcTopTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcTopTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
