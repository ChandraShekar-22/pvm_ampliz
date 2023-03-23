import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IcContainerComponent } from './ic-container.component';

describe('IcContainerComponent', () => {
  let component: IcContainerComponent;
  let fixture: ComponentFixture<IcContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IcContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
