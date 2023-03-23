import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentViewmoreCardComponent } from './recent-viewmore-card.component';

describe('RecentViewmoreCardComponent', () => {
  let component: RecentViewmoreCardComponent;
  let fixture: ComponentFixture<RecentViewmoreCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentViewmoreCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentViewmoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
