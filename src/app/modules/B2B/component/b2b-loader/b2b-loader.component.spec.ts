import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { B2bLoaderComponent } from './b2b-loader.component';

describe('B2bLoaderComponent', () => {
  let component: B2bLoaderComponent;
  let fixture: ComponentFixture<B2bLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
