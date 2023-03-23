import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemoveTeammateDrawerComponent } from './remove-teammate-drawer.component';

describe('RemoveTeammateDrawerComponent', () => {
  let component: RemoveTeammateDrawerComponent;
  let fixture: ComponentFixture<RemoveTeammateDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveTeammateDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveTeammateDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
