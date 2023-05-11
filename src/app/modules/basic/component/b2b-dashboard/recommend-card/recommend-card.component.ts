import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';

@Component({
  selector: 'app-recommend-card',
  templateUrl: './recommend-card.component.html',
  styleUrls: ['./recommend-card.component.css'],
})
export class RecommendCardComponent implements OnInit {
  tabs = [
    {
      title: 'Companies',
      content: [],
    },
    {
      title: 'Contacts',
      content: [],
    },
  ];
  loader: boolean = false;
  activeTab: number = 1;
  constructor(private b2bService: B2bService, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.setActive(0);
  }

  setActive(tab: number) {
    this.loader = true;
    this.activeTab = tab;
    if (tab === 0) {
      this.getCompanies();
    } else {
      this.getContacts();
    }
  }
  getCompanies() {
    this.b2bService.getCompaniesForDashboard().subscribe(
      (res) => {
        this.tabs[0].content = res.companyInfoList;
        this.loader = false;
      },
      (err) => (this.loader = false)
    );
  }

  getContacts() {
    this.b2bService.getContactsForDashboard().subscribe(
      (res) => {
        this.tabs[1].content = res.contactInfoList;
        this.loader = false;
      },
      (err) => (this.loader = false)
    );
  }

  viewEmployees(company: any) {
    this.router.navigate(['/b2b'], { queryParams: { companyName: company } });
  }

  viewContact(contact: any) {
    this.router.navigate(['/b2b'], {
      queryParams: {
        name: contact.fullName,
        country: contact.country,
        department: contact.department,
      },
    });
  }

  searchMore(company: boolean) {
    if (company) {
      this.dataService.changeSelectedTab(1);
    } else {
      this.dataService.changeSelectedTab(0);
    }
    this.router.navigate(['/b2b']);
  }
}
