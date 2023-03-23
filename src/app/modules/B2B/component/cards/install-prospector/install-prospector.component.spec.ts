import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstallProspectorComponent } from './install-prospector.component';

describe('InstallProspectorComponent', () => {
  let component: InstallProspectorComponent;
  let fixture: ComponentFixture<InstallProspectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallProspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallProspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
