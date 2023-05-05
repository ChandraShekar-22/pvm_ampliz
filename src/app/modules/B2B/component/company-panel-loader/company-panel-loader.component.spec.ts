import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPanelLoaderComponent } from './company-panel-loader.component';

describe('CompanyPanelLoaderComponent', () => {
  let component: CompanyPanelLoaderComponent;
  let fixture: ComponentFixture<CompanyPanelLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyPanelLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPanelLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
