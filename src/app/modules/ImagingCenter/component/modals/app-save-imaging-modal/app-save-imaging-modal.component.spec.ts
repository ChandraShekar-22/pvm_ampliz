import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppSaveImagingModalComponent } from './app-save-imaging-modal.component';

describe('AppSaveImagingModalComponent', () => {
  let component: AppSaveImagingModalComponent;
  let fixture: ComponentFixture<AppSaveImagingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSaveImagingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSaveImagingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
