import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendCardComponent } from './recommend-card.component';

describe('RecommendCardComponent', () => {
  let component: RecommendCardComponent;
  let fixture: ComponentFixture<RecommendCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
