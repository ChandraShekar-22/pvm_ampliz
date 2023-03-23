import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { B2bSavelistComponent } from './b2b-savelist.component';

describe('B2bSavelistComponent', () => {
  let component: B2bSavelistComponent;
  let fixture: ComponentFixture<B2bSavelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bSavelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bSavelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
