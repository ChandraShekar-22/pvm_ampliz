import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoResultComponent } from './no-result.component';

describe('NoResultComponent', () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NoResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
