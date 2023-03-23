import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactsCompanyTabComponent } from './contacts-company-tab.component';

describe('ContactsCompanyTabComponent', () => {
  let component: ContactsCompanyTabComponent;
  let fixture: ComponentFixture<ContactsCompanyTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCompanyTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsCompanyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
