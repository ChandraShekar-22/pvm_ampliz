import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveLtcModalComponent } from './save-ltc-modal.component';

describe('SaveLtcModalComponent', () => {
  let component: SaveLtcModalComponent;
  let fixture: ComponentFixture<SaveLtcModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveLtcModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveLtcModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
