import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExecutivePageComponent } from './executive-page.component';

describe('ExecutivePageComponent', () => {
  let component: ExecutivePageComponent;
  let fixture: ComponentFixture<ExecutivePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutivePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
