import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCsvBtnComponent } from './export-csv-btn.component';

describe('ExportCsvBtnComponent', () => {
  let component: ExportCsvBtnComponent;
  let fixture: ComponentFixture<ExportCsvBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportCsvBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCsvBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
