import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatelistComponent } from './createlist.component';

describe('CreatelistComponent', () => {
  let component: CreatelistComponent;
  let fixture: ComponentFixture<CreatelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
