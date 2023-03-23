import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkSaveLtcCardComponent } from './bulk-save-ltc-card.component';

describe('BulkSaveLtcCardComponent', () => {
  let component: BulkSaveLtcCardComponent;
  let fixture: ComponentFixture<BulkSaveLtcCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSaveLtcCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSaveLtcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
