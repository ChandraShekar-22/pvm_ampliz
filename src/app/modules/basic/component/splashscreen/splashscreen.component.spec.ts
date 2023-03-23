import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SplashscreenComponent } from './splashscreen.component';

describe('SplashscreenComponent', () => {
  let component: SplashscreenComponent;
  let fixture: ComponentFixture<SplashscreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
