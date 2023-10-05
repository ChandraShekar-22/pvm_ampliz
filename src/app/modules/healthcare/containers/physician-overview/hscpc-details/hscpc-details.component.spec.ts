import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HscpcDetailsComponent } from './hscpc-details.component';

describe('HscpcDetailsComponent', () => {
  let component: HscpcDetailsComponent;
  let fixture: ComponentFixture<HscpcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HscpcDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HscpcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
