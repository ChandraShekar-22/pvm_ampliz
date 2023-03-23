import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListfilterComponent } from './listfilter.component';

describe('ListfilterComponent', () => {
  let component: ListfilterComponent;
  let fixture: ComponentFixture<ListfilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
