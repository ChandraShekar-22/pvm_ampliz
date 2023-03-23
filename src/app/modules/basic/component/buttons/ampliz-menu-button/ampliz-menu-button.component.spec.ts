import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmplizMenuButtonComponent } from './ampliz-menu-button.component';

describe('AmplizMenuButtonComponent', () => {
  let component: AmplizMenuButtonComponent;
  let fixture: ComponentFixture<AmplizMenuButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmplizMenuButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmplizMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
