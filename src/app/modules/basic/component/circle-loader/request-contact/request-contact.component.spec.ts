import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestContactComponent } from './request-contact.component';

describe('RequestContactComponent', () => {
  let component: RequestContactComponent;
  let fixture: ComponentFixture<RequestContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
