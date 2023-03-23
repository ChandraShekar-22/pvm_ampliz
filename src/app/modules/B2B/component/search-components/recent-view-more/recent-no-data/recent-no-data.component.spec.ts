import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentNoDataComponent } from './recent-no-data.component';

describe('RecentNoDataComponent', () => {
  let component: RecentNoDataComponent;
  let fixture: ComponentFixture<RecentNoDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentNoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
