import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaginationUpgradeComponent } from './pagination-upgrade.component';

describe('PaginationUpgradeComponent', () => {
  let component: PaginationUpgradeComponent;
  let fixture: ComponentFixture<PaginationUpgradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
