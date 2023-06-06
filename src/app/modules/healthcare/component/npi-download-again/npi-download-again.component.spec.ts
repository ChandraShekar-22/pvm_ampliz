import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiDownloadAgainComponent } from './npi-download-again.component';

describe('NpiDownloadAgainComponent', () => {
  let component: NpiDownloadAgainComponent;
  let fixture: ComponentFixture<NpiDownloadAgainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiDownloadAgainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiDownloadAgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
