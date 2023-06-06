import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiListLoaderComponent } from './npi-list-loader.component';

describe('NpiListLoaderComponent', () => {
  let component: NpiListLoaderComponent;
  let fixture: ComponentFixture<NpiListLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
