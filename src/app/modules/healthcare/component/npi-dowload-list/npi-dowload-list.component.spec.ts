import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiDowloadListComponent } from './npi-dowload-list.component';

describe('NpiDowloadListComponent', () => {
  let component: NpiDowloadListComponent;
  let fixture: ComponentFixture<NpiDowloadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiDowloadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiDowloadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
