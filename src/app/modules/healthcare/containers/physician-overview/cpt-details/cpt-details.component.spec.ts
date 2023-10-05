import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CptDetailsComponent } from './cpt-details.component';

describe('CptDetailsComponent', () => {
  let component: CptDetailsComponent;
  let fixture: ComponentFixture<CptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CptDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
