import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PayorFilterComponent } from "./payor-filter.component";

describe("FilterComponent", () => {
  let component: PayorFilterComponent;
  let fixture: ComponentFixture<PayorFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayorFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
