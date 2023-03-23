import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavePhycisianModalComponent } from './save-phycisian-modal.component';

describe('SavePhycisianModalComponent', () => {
  let component: SavePhycisianModalComponent;
  let fixture: ComponentFixture<SavePhycisianModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePhycisianModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePhycisianModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
