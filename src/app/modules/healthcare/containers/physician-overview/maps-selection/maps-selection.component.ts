import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';

@Component({
	selector: 'app-maps-selection',
	templateUrl: './maps-selection.component.html',
	styleUrls: ['./maps-selection.component.css']
})
export class MapsSelectionComponent implements OnInit {
	@Input() mapsData: { hospitalLocation: string; hospitalName: string }[] = [];
	@Input() name: string;
	@Input() hideMore: boolean = false;
	@Input() physicianOverviewResult: any;
	hospitalLocation: { hospitalLocation: string; hospitalName: string };
	loading: boolean = false;
	similarPhysicianList: any = [];

	constructor(
		private domSanitizer: DomSanitizer,
		private amplizService: AmplizService,
		private loaderServe: LoaderService,
		private messageService: MessageService
	) {}

	ngOnInit(): void {
		this.hospitalLocation = this.mapsData?.[0] || { hospitalLocation: '', hospitalName: '' };
		if (this.hospitalLocation) {
			this.getSimilarPhysician(this.hospitalLocation.hospitalLocation);
		}
	}
	ngOnChages(changes: any) {}

	get mapList() {
		return this.mapsData;
	}

	get MapUrl() {
		return this.domSanitizer.bypassSecurityTrustResourceUrl(
			`https://www.google.com/maps/embed/v1/place?key=AIzaSyA9MPVyBx9QI03grz7fgaUuLmwcJ8lwd9k&q=${this.hospitalLocation.hospitalLocation}‌`
		);
	}
	get hideMap() {
		return this.mapsData.length !== 0;
	}
	onSelectList(hospital: any) {
		this.hospitalLocation = hospital;
		this.getSimilarPhysician(hospital.hospitalLocation);
	}
	getSimilarPhysician(address: string) {
		this.loading = true;
		this.amplizService
			.getSmiliarPhysicianByLocation({
				address
			})
			.subscribe(
				(res) => {
					this.loading = false;
					this.similarPhysicianList = res.similarPhysicianList;
				},
				(err) => {
					this.loading = false;
				}
			);
	}
}
