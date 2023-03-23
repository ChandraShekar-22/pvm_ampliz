import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveContactModalComponent } from './save-contact-modal.component';

describe('SaveContactModalComponent', () => {
  let component: SaveContactModalComponent;
  let fixture: ComponentFixture<SaveContactModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveContactModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
