import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedViewMoreComponent } from './saved-view-more.component';

describe('SavedViewMoreComponent', () => {
  let component: SavedViewMoreComponent;
  let fixture: ComponentFixture<SavedViewMoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedViewMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
