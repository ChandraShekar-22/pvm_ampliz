import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectBulkModalComponent } from './select-bulk-modal.component';

describe('SelectBulkModalComponent', () => {
  let component: SelectBulkModalComponent;
  let fixture: ComponentFixture<SelectBulkModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBulkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBulkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
