import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ButtoncellrendererComponent } from './buttoncellrenderer.component';

describe('ButtoncellrendererComponent', () => {
  let component: ButtoncellrendererComponent;
  let fixture: ComponentFixture<ButtoncellrendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtoncellrendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtoncellrendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
