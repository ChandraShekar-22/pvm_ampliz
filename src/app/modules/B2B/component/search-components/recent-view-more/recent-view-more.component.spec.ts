import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentViewMoreComponent } from './recent-view-more.component';

describe('RecentViewMoreComponent', () => {
  let component: RecentViewMoreComponent;
  let fixture: ComponentFixture<RecentViewMoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentViewMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
