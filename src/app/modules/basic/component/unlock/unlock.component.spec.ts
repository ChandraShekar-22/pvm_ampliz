import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnlockComponent } from './unlock.component';

describe('UnlockComponent', () => {
  let component: UnlockComponent;
  let fixture: ComponentFixture<UnlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
