import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApisComponent } from './apis.component';

describe('ApisComponent', () => {
  let component: ApisComponent;
  let fixture: ComponentFixture<ApisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
