import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewmoreCardComponent } from './viewmore-card.component';

describe('ViewmoreCardComponent', () => {
  let component: ViewmoreCardComponent;
  let fixture: ComponentFixture<ViewmoreCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewmoreCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
