import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePayourModalComponent } from './save-payour-modal.component';

describe('SavePayourModalComponent', () => {
  let component: SavePayourModalComponent;
  let fixture: ComponentFixture<SavePayourModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePayourModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePayourModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
