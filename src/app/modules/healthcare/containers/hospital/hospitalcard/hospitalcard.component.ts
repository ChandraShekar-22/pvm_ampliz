import { Component, OnInit, Input, Output, EventEmitter, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FilterStorageService } from '../../../services/filter-storage.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
	selector: 'app-hospitalcard',
	templateUrl: './hospitalcard.component.html',
	styleUrls: ['./hospitalcard.component.css']
})
export class HospitalcardComponent implements OnInit {
	@Input() hospitalData: any;
	@Input() dataIndex: any;
	@Output() DataRefreshed: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('contactPanelTrigger') contactPanelTrigger: MatMenuTrigger;
	notCorrectDrawer: boolean = false;
	saveDrawer: boolean = false;
	constructor(
		private router: Router,
		private ngZone: NgZone,
		private filterStorageService: FilterStorageService,
		private elementRef: ElementRef,
		private clipboard: Clipboard,
		private messageService: MessageService
	) {}

	get location() {
		return `${this.hospitalData.city}, ${this.hospitalData.state}`;
	}

	ngOnInit() {
		this.elementRef.nativeElement.style.setProperty('--animation-order', this.dataIndex);
	}

	cancelBtnClick(value: boolean) {
		this.saveDrawer = value;
		this.notCorrectDrawer = value;
		setTimeout(() => {
			this.DataRefreshed.emit(true);
		}, 1000);
	}

	gotoContacts(hospitalName: string) {
		this.filterStorageService.set('physician_specialityIncluded', '');
		this.filterStorageService.set('physician_specialityExcluded', '');
		this.filterStorageService.set('physician_physicianName', '');
		this.filterStorageService.set('physician_cityList', '');
		this.filterStorageService.set('physician_stateList', '');
		this.filterStorageService.set('physician_npiNumber', '');
		this.filterStorageService.set('physician_hospital', [hospitalName]);
		this.router.navigate(['physician']);
	}

	openSocial(link: any) {
		window.open(link, '_blank').focus();
	}

	handleAction(action: any, value?: any) {
		if (action === 'close') {
			this.contactPanelTrigger.closeMenu();
		} else {
			this.clipboard.copy(value);
			this.messageService.display(true, 'Copied!');
		}
	}
}
