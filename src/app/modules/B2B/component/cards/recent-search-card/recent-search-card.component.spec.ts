import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentSearchCardComponent } from './recent-search-card.component';

describe('RecentSearchCardComponent', () => {
  let component: RecentSearchCardComponent;
  let fixture: ComponentFixture<RecentSearchCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentSearchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
