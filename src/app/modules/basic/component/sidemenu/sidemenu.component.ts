import { Component, OnInit, Input, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { DataService } from 'src/app/modules/B2B/services/data.service'

@Component({
	selector: 'app-sidemenu',
	templateUrl: './sidemenu.component.html',
	styleUrls: ['./sidemenu.component.css'],
})
export class SidemenuComponent implements OnInit {
	@Input() elementName = 'dashboard'
	public isSpecialityUser
	constructor(private router: Router, private ngZone: NgZone, private dataService: DataService) {}
	get dataSet() {
		return localStorage.getItem('Dataset') as string
	}
	get isAdmin() {
		return localStorage.getItem('isAdmin')
	}

	ngOnInit() {
		this.isSpecialityUser = localStorage.getItem('is_SpecialityUser') == 'true' ? true : false
	}
	public openItem(item: any): void {
		// console.log(item, "item");
		if (item == 'b2b') {
			this.dataService.changeSelectedTab(0)
		}
		this.elementName = item
		this.ngZone.run(() => this.router.navigateByUrl(item)).then()
	}
}
