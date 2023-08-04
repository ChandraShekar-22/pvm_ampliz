import { animate, style, transition, trigger } from '@angular/animations'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { MessageService } from 'src/app/modules/B2B/services/message.service'
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service'
import { ImagingService } from 'src/app/modules/ImagingCenter/services/imaging.service'
import { PayorService } from '../../service/payor.service'

@Component({
	selector: 'app-payor-not-correct',
	templateUrl: './payor-not-correct.component.html',
	styleUrls: ['./payor-not-correct.component.css'],
	animations: [
		trigger('enterAnimation', [
			transition(':enter', [
				style({ transform: 'translateX(100%)', opacity: 0 }),
				animate('300ms', style({ transform: 'translateX(0)', opacity: 1 })),
			]),
			transition(':leave', [
				style({ transform: 'translateX(0)', opacity: 1 }),
				animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 })),
			]),
		]),
	],
})
export class PayorNotCorrectComponent implements OnInit {
	showOtherTextField: boolean = false
	@Input() notCorrectReasons: Array<any> = [
		'Company Name',
		'Title',
		'Department',
		'Seniority',
		'Name',
		'Location',
	]
	selectedReason: string = ''
	@Input() imagingId: any = ''
	@Input() notCorrectType: any = 'imaging-executive'
	@ViewChild('menuTrigger', { static: false }) menuTrigger: MatMenuTrigger
	constructor(
		private b2bService: ImagingService,
		private loaderServe: LoaderService,
		private messageService: MessageService,
		private payorService: PayorService
	) {}
	ngOnInit() {}

	otherClicked(event) {
		event.stopPropagation()
		this.showOtherTextField = true
		this.selectedReason = ''
	}
	matMenuOpened() {
		this.showOtherTextField = false
	}
	selectReason(reason: any) {
		if (reason !== '') {
			this.menuTrigger.closeMenu()
			this.loaderServe.display(true)
			this.selectedReason = reason
			if (this.notCorrectType === 'imaging-executive') {
				this.reportDataNotCorrectForExecutive(reason)
			} else {
				this.reportDataNotCorrectForImaging(reason)
			}
		}
	}

	reportDataNotCorrectForImaging(reason) {
		const body = {
			incorrectDataList: [reason],
			mcoCompanyId: this.imagingId,
		}
		this.payorService.reportDataNotCorrectForPayor(body).subscribe(
			(res) => {
				this.loaderServe.display(false)
				this.messageService.display(true, 'Updated the information')
			},
			(err) => {
				this.loaderServe.display(false)
				this.messageService.displayError(true, 'Error')
			}
		)
	}

	reportDataNotCorrectForExecutive(reason) {
		const body = {
			incorrectDataList: [reason],
			mcoExecutive: this.imagingId,
		}
		this.payorService.reportDataNotCorrectForExecutivePayor(body).subscribe(
			(res) => {
				this.loaderServe.display(false)
				this.messageService.display(true, 'Updated the information')
			},
			(err) => {
				this.loaderServe.display(false)
				this.messageService.displayError(true, 'Error')
			}
		)
	}
}
