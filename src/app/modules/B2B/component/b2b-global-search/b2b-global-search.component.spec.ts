import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { B2bGlobalSearchComponent } from './b2b-global-search.component';

describe('B2bGlobalSearchComponent', () => {
  let component: B2bGlobalSearchComponent;
  let fixture: ComponentFixture<B2bGlobalSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bGlobalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
