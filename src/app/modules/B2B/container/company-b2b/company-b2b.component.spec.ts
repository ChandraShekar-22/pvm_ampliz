import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyB2bComponent } from './company-b2b.component';

describe('CompanyB2bComponent', () => {
  let component: CompanyB2bComponent;
  let fixture: ComponentFixture<CompanyB2bComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyB2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
