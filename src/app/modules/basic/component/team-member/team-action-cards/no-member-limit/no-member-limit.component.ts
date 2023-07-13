import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
	selector: 'app-no-member-limit',
	templateUrl: './no-member-limit.component.html',
	styleUrls: ['./no-member-limit.component.css'],
})
export class NoMemberLimitComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit(): void {}

	handleUpgrade() {
		this.router.navigate(['pricing']);
	}
}
