import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActionButtonComponent } from './list-action-button.component';

describe('ListActionButtonComponent', () => {
  let component: ListActionButtonComponent;
  let fixture: ComponentFixture<ListActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListActionButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
