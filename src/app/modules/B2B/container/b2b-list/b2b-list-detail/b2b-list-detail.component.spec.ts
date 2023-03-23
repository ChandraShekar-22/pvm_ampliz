import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { B2bListDetailComponent } from './b2b-list-detail.component';

describe('B2bListDetailComponent', () => {
  let component: B2bListDetailComponent;
  let fixture: ComponentFixture<B2bListDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
