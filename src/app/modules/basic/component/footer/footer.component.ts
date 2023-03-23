import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AmplizService } from '../../../healthcare/services/ampliz.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() dashboard: boolean;
  username = 'Name';
  @Input() elementName = 'dashboard';
  constructor(
    private router: Router,
    private amplizService: AmplizService,
    ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }
  // openItem() {
  //   if (this.dashboard) {
  //     this.router.navigate(['favourite']);
  //   } else {
  //     this.router.navigate(['dashboard']);
  //   }
  // }
  logout() {
    this.amplizService.logout();
  }
  editprofile() {

  }
  toggleSideMenu() {
    let el: HTMLElement = document.getElementsByTagName('body')[0];
    if (el.classList['0'] === 'enlarged') {
    el.classList.remove('enlarged');
    } else {
      el.classList.add('enlarged');
    }
  }
  navigateItem(item) {
    this.elementName = item;
    if (item === 'editprofile') {
      this.router.navigate(['editprofile']);
    }
  }

}
