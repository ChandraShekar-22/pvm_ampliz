import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySearchCardComponent } from './history-search-card.component';

describe('HistorySearchCardComponent', () => {
  let component: HistorySearchCardComponent;
  let fixture: ComponentFixture<HistorySearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorySearchCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorySearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
