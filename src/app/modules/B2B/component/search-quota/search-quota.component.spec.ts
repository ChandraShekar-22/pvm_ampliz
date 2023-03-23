import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchQuotaComponent } from './search-quota.component';

describe('SearchQuotaComponent', () => {
  let component: SearchQuotaComponent;
  let fixture: ComponentFixture<SearchQuotaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
