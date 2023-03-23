import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveExecutiveModalComponent } from './save-executive-modal.component';

describe('SaveExecutiveModalComponent', () => {
  let component: SaveExecutiveModalComponent;
  let fixture: ComponentFixture<SaveExecutiveModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveExecutiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveExecutiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
