import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddRemoveCreditDrawerComponent } from './add-remove-credit-drawer.component';

describe('AddRemoveCreditDrawerComponent', () => {
  let component: AddRemoveCreditDrawerComponent;
  let fixture: ComponentFixture<AddRemoveCreditDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveCreditDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveCreditDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
