import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { B2bCreateListComponent } from './b2b-create-list.component';

describe('B2bCreateListComponent', () => {
  let component: B2bCreateListComponent;
  let fixture: ComponentFixture<B2bCreateListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bCreateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bCreateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
