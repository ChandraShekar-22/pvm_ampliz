import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardDividerComponent } from './card-divider.component';

describe('CardDividerComponent', () => {
  let component: CardDividerComponent;
  let fixture: ComponentFixture<CardDividerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDividerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
