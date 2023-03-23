import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkSaveImagingCardComponent } from './bulk-save-imaging-card.component';

describe('BulkSaveImagingCardComponent', () => {
  let component: BulkSaveImagingCardComponent;
  let fixture: ComponentFixture<BulkSaveImagingCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSaveImagingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSaveImagingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
