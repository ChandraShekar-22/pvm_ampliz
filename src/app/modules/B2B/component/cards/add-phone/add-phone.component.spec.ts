import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPhoneComponent } from './add-phone.component';

describe('AddPhoneComponent', () => {
  let component: AddPhoneComponent;
  let fixture: ComponentFixture<AddPhoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
