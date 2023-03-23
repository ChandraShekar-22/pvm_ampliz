import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkSaveCardComponent } from './bulk-save-card.component';

describe('BulkSaveCardComponent', () => {
  let component: BulkSaveCardComponent;
  let fixture: ComponentFixture<BulkSaveCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSaveCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSaveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
