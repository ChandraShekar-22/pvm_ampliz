import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxDataComponent } from './rx-data.component';

describe('RxDataComponent', () => {
  let component: RxDataComponent;
  let fixture: ComponentFixture<RxDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RxDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RxDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
