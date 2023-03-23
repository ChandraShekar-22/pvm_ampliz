import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndustryCardComponent } from './industry-card.component';

describe('IndustryCardComponent', () => {
  let component: IndustryCardComponent;
  let fixture: ComponentFixture<IndustryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
