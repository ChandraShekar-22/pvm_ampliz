import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-maps-selection',
	templateUrl: './maps-selection.component.html',
	styleUrls: ['./maps-selection.component.css']
})
export class MapsSelectionComponent implements OnInit {
	@Input() mapsData: { hospitalLocation: string; hospitalName: string }[] = [];
	hospitalLocation: { hospitalLocation: string; hospitalName: string };

	constructor(private domSanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.hospitalLocation = this.mapsData?.[0] || { hospitalLocation: '', hospitalName: '' };
	}
	ngOnChages(changes: any) {}

	get MapUrl() {
		return this.domSanitizer.bypassSecurityTrustResourceUrl(
			`https://www.google.com/maps/embed/v1/place?key=AIzaSyA9MPVyBx9QI03grz7fgaUuLmwcJ8lwd9k&q=${this.hospitalLocation.hospitalLocation}‌`
		);
	}
	get hideMap() {
		return this.mapsData.length !== 0;
	}
	onSelectList(hospitalLocation: any) {
		this.hospitalLocation = hospitalLocation;
	}
}
