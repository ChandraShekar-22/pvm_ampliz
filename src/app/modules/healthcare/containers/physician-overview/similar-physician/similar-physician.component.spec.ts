import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarPhysicianComponent } from './similar-physician.component';

describe('SimilarPhysicianComponent', () => {
  let component: SimilarPhysicianComponent;
  let fixture: ComponentFixture<SimilarPhysicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimilarPhysicianComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
