import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentSearchPageComponent } from './recent-search-page.component';

describe('RecentSearchPageComponent', () => {
  let component: RecentSearchPageComponent;
  let fixture: ComponentFixture<RecentSearchPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
