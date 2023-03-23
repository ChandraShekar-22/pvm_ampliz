import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveSearchCardComponent } from './save-search-card.component';

describe('SaveSearchCardComponent', () => {
  let component: SaveSearchCardComponent;
  let fixture: ComponentFixture<SaveSearchCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveSearchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
