import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveCompanyModalComponent } from './save-company-modal.component';

describe('SaveCompanyModalComponent', () => {
  let component: SaveCompanyModalComponent;
  let fixture: ComponentFixture<SaveCompanyModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveCompanyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
