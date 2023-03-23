import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { B2bListComponent } from './b2b-list.component';

describe('B2bListComponent', () => {
  let component: B2bListComponent;
  let fixture: ComponentFixture<B2bListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
