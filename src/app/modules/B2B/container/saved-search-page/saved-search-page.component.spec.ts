import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedSearchPageComponent } from './saved-search-page.component';

describe('SavedSearchPageComponent', () => {
  let component: SavedSearchPageComponent;
  let fixture: ComponentFixture<SavedSearchPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
