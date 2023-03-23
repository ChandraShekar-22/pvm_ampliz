import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotcorrectComponent } from './notcorrect.component';

describe('NotcorrectComponent', () => {
  let component: NotcorrectComponent;
  let fixture: ComponentFixture<NotcorrectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotcorrectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotcorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
