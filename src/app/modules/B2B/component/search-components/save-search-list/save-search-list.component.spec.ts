import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveSearchListComponent } from './save-search-list.component';

describe('SaveSearchListComponent', () => {
  let component: SaveSearchListComponent;
  let fixture: ComponentFixture<SaveSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
