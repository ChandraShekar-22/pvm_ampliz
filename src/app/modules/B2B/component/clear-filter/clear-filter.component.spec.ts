import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearFilterComponent } from './clear-filter.component';

describe('ClearFilterComponent', () => {
  let component: ClearFilterComponent;
  let fixture: ComponentFixture<ClearFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
