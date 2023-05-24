import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiFileUploadComponent } from './npi-file-upload.component';

describe('NpiFileUploadComponent', () => {
  let component: NpiFileUploadComponent;
  let fixture: ComponentFixture<NpiFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
