import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedNoDataComponent } from './saved-no-data.component';

describe('SavedNoDataComponent', () => {
  let component: SavedNoDataComponent;
  let fixture: ComponentFixture<SavedNoDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedNoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
