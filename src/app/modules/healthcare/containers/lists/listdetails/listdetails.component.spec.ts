import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListdetailsComponent } from './listdetails.component';

describe('ListdetailsComponent', () => {
  let component: ListdetailsComponent;
  let fixture: ComponentFixture<ListdetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
