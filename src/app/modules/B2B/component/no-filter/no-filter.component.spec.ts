import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoFilterComponent } from './no-filter.component';

describe('NoFilterComponent', () => {
  let component: NoFilterComponent;
  let fixture: ComponentFixture<NoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
