import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DomainsearchComponent } from './domainsearch.component';

describe('DomainsearchComponent', () => {
  let component: DomainsearchComponent;
  let fixture: ComponentFixture<DomainsearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
