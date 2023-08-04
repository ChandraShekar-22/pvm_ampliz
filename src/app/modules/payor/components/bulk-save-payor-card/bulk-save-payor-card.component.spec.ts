import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSavePayorCardComponent } from './bulk-save-payor-card.component';

describe('BulkSavePayorCardComponent', () => {
  let component: BulkSavePayorCardComponent;
  let fixture: ComponentFixture<BulkSavePayorCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSavePayorCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSavePayorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
