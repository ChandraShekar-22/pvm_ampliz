import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIconAgGridComponent } from './delete-icon-ag-grid.component';

describe('DeleteIconAgGridComponent', () => {
  let component: DeleteIconAgGridComponent;
  let fixture: ComponentFixture<DeleteIconAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteIconAgGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteIconAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
