import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoTooltipComponent } from './contact-info-tooltip.component';

describe('ContactInfoTooltipComponent', () => {
  let component: ContactInfoTooltipComponent;
  let fixture: ComponentFixture<ContactInfoTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactInfoTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactInfoTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
