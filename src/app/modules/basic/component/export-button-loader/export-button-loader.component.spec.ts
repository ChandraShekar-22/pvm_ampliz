import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportButtonLoaderComponent } from './export-button-loader.component';

describe('ExportButtonLoaderComponent', () => {
  let component: ExportButtonLoaderComponent;
  let fixture: ComponentFixture<ExportButtonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportButtonLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportButtonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
