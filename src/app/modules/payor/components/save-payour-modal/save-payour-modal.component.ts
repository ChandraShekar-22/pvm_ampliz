import { animate, style, transition, trigger } from '@angular/animations'
import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatMenuTrigger } from '@angular/material/menu'
import { Subscription } from 'rxjs'
import { MessageService } from 'src/app/modules/B2B/services/message.service'
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service'
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service'
import { DataService } from '../../service/data.service'
import { PayorService } from '../../service/payor.service'

@Component({
	selector: 'app-save-payour-modal',
	templateUrl: './save-payour-modal.component.html',
	styleUrls: ['./save-payour-modal.component.css'],
	animations: [
		trigger('enterAnimation', [
			transition(':enter', [
				style({ transform: 'translateX(100%)', opacity: 0 }),
				animate('300ms', style({ transform: 'translateX(0)', opacity: 1 })),
			]),
		]),
		trigger('leaveAnimation', [
			transition(':enter', [
				style({ transform: 'translateX(0)', opacity: 0 }),
				animate('300ms', style({ transform: 'translateX(100%)', opacity: 1 })),
			]),
		]),
	],
})
export class SavePayourModalComponent implements OnInit {
	@Input() title: string = 'Save'
	@Input() isSaveButton: boolean = true
	@Input() fromCard: boolean = false
	@Input() selectedItems: Array<any> = []
	// @Input() showBulkSave: boolean = true;
	// @Input() singleSave: boolean = true;
	@Output() successfullyAdded = new EventEmitter()
	@Input() allContactsSelected = false
	@Input() selectedFilter: any = {}

	showCreateNew: boolean = false
	listName: string = ''
	apacList: Array<any> = []
	subscription: Subscription
	private selectedList: any = null
	bulkSaveEnabled: boolean = false
	bulkSaveCount: number = 5
	@Input() totalItemCount: number = 5000
	@ViewChild('menuTrigger', { static: false }) menuTrigger: MatMenuTrigger
	@ViewChild('bulksaveInput', { static: false }) bulksaveInput: ElementRef

	listGroupContact = new FormGroup({
		select: new FormControl(null, Validators.required),
	})

	listNameGroup = new FormGroup({
		listName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
	})
	@ViewChild('f', { static: false }) myNgForm

	constructor(
		private dataService: DataService,
		private messageService: MessageService,
		private loaderService: LoaderService,
		private amplizService: AmplizService,
		private payorService: PayorService
	) {}

	ngOnInit() {
		// this.getApacList();
		this.subscription = this.dataService.apacListSubscriber.subscribe((data) => {
			this.apacList = data
		})
	}

	handleCreateNewPress(event) {
		event.stopPropagation()
		this.showCreateNew = !this.showCreateNew
		this.listNameGroup.reset()
	}

	createB2bApackList(event) {
		const listName = this.listNameGroup.value.listName
		event.stopPropagation()
		if (this.listNameGroup.valid) {
			this.loaderService.display(true)
			const body = {
				listName: listName,
			}
			this.payorService.createList(body).subscribe(
				(res) => {
					this.loaderService.display(false)
					this.showCreateNew = false
					this.messageService.display(true, 'Successfully created the list', 'Saved Successfully')
					this.getApacList()
				},
				(error) => {
					this.loaderService.display(false)
				}
			)
		}
	}

	handleSavePress(event) {
		event.stopPropagation()
		if (this.listGroupContact.valid == true) {
			if (this.bulkSaveEnabled) {
				this.bulkSave()
			} else {
				if (this.fromCard == true) {
					this.saveViewedContact()
				} else {
					this.addContactToList()
				}
			}
		}
	}

	bulkSave() {
		if (this.bulkSaveCount > 0) {
			this.loaderService.display(true)
			const selectedList = this.listGroupContact.value.select || {}
			const body = {
				listId: selectedList.listId,
				recordCount: this.bulkSaveCount,
				searchInputMCOExecutives: this.selectedFilter,
			}
			this.payorService.savePayourAsPerCount(body).subscribe(
				(res) => {
					this.loaderService.display(false)
					this.messageService.display(true, 'Successfully added to the list')
					this.listGroupContact.reset()
					this.successfullyAdded.emit()
					this.menuTrigger.closeMenu()
				},
				(error) => {
					this.loaderService.display(false)
					this.menuTrigger.closeMenu()
				}
			)
		}
	}

	addContactToList() {
		this.loaderService.display(true)
		const selectedList = this.listGroupContact.value.select || {}
		if (this.selectedItems.length > 0) {
			const body = {
				listid: selectedList.listId,
				leadIdList: this.selectedItems,
				leadType: 'MCOExecutive',
			}
			this.amplizService.addLeadsToList(body).subscribe(
				(res: any) => {
					this.loaderService.display(false)
					this.messageService.display(true, 'Successfully added to the list')
					this.listGroupContact.reset()
					this.successfullyAdded.emit()
					this.menuTrigger.closeMenu()
				},
				(error) => {
					this.loaderService.display(false)
					this.menuTrigger.closeMenu()
				}
			)
		}
	}

	getApacList() {
		this.payorService.getLists(0, 1000).subscribe((res) => {
			// console.log(res)
			this.dataService.changeApacList(res.savedlistInfoList)
		})
	}

	ngOnDestroy() {}

	bulkUploadDataChanged(event) {
		if (this.selectedItems.length > 0) {
			this.bulkSaveEnabled = !this.bulkSaveEnabled
			this.focusContactInput()
		}
	}

	focusContactInput() {
		setTimeout(() => {
			if (this.bulksaveInput) {
				this.bulksaveInput.nativeElement.focus()
			}
		}, 100)
	}
	// handleSaveTrigger() {
	//   if (this.selectedItems.length == 0) {
	//     this.bulkSaveEnabled = true;
	//     this.focusContactInput();
	//   } else {
	//     this.bulkSaveEnabled = false;
	//   }
	// }

	handleSaveTrigger() {
		this.listGroupContact.reset()
		this.myNgForm.resetForm()
	}

	viewContact() {
		const body = {
			mcoExecutiveId: this.selectedItems[0],
		}
		this.loaderService.display(true)
		this.payorService.viewPayourFromList(body).subscribe(
			(res) => {
				this.loaderService.display(false)
				// this.messageService.display(true, "Successfully added to the list");
				this.payorService.getPayourDetails(this.selectedItems[0]).subscribe((overview) => {
					this.dataService.addToSavedLTC([overview.mcoExecutiveInfo])
				})
				this.successfullyAdded.emit()
			},
			(err) => {
				this.loaderService.display(false)
			}
		)
	}

	saveViewedContact() {
		const selectedList = this.listGroupContact.value.select || {}
		const body = {
			listId: selectedList.listId,
			leadId: this.selectedItems[0],
		}
		this.payorService.saveViewedPayour(body).subscribe(
			(res) => {
				this.messageService.display(true, 'Successfully added to the list')
				setTimeout(() => {
					this.payorService.getPayourDetails(this.selectedItems[0]).subscribe((overview) => {
						this.dataService.addToSavedLTC([overview.mcoExecutiveInfo])
					})
				}, 400)

				this.successfullyAdded.emit()
			},
			(err) => {}
		)
	}
}
