import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { SkeletonloaderService } from 'src/app/modules/healthcare/services/skeletonloader.service';

@Component({
	selector: 'app-save-phycisian-modal',
	templateUrl: './save-phycisian-modal.component.html',
	styleUrls: ['./save-phycisian-modal.component.css'],
	animations: [
		trigger('enterAnimation', [
			transition(':enter', [
				style({ transform: 'translateX(100%)', opacity: 0 }),
				animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
			])
		]),
		trigger('leaveAnimation', [
			transition(':enter', [
				style({ transform: 'translateX(0)', opacity: 0 }),
				animate('300ms', style({ transform: 'translateX(100%)', opacity: 1 }))
			])
		])
	]
})
export class SavePhycisianModalComponent implements OnInit {
	@Input() title: string = 'Save';
	@Input() selectedItems: Array<any> = [];
	@Input() isDisabled: boolean = false;
	@Input() filterParams: any = {};
	@Output() successfullyAdded = new EventEmitter();
	showCreateNew: boolean = false;
	apacList: Array<any> = [];
	subscription: Subscription;
	updatedCredits: any = localStorage.getItem('credits');
	isSpecialityUser: boolean = false;
	bulkSaveEnabled: boolean = false;
	numberOfPhysicians: number = 5;
	isListFormInValid: boolean = false;
	isCreateFormInValid: boolean = false;
	@ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
	@ViewChild('physicianInput') physicianInput: ElementRef;
	listGroup = new UntypedFormGroup({
		select: new UntypedFormControl(null, Validators.required)
	});

	listNameGroup = new UntypedFormGroup({
		listName: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)])
	});
	constructor(
		private amplizService: AmplizService,
		private ngZone: NgZone,
		public router: Router,
		public loaderService: SkeletonloaderService,
		public messageService: MessageService
	) {}

	ngOnInit() {
		this.getAllList();
		// this.subscription = this.dataService.apacListSubscriber.subscribe(data => {
		//   this.apacList = data;
		// });
		setTimeout(() => {
			this.isSpecialityUser = localStorage.getItem('is_SpecialityUser') == 'true' ? true : false;
		}, 10);
		this.getDashboardDetails();
	}
	getAllList() {
		this.amplizService.getAllList(0, 1000, false).subscribe(
			(res) => {
				this.apacList = res.savedlistInfoList;
			},
			(err) => {}
		);
	}

	handleCreateNewPress(event) {
		event.stopPropagation();
		this.showCreateNew = !this.showCreateNew;
		this.listNameGroup.reset();
		// this.listName = '';
		// console.log(this.showCreateNew)
	}

	createB2bApackList(event) {
		event.stopPropagation();
		const listName = this.listNameGroup.value.listName;
		if (this.listNameGroup.valid) {
			this.amplizService.createList(listName).subscribe(
				(res) => {
					this.showCreateNew = false;
					this.messageService.display(true, 'Successfully created the list');
					this.getAllList();
				},
				(error) => {
					let msg: any = 'Error';
					if (error.error) {
						msg = error.error[0].message || 'Error';
					}
					this.messageService.displayError(true, msg);
				}
			);
		}
	}

	async getDashboardDetails() {
		this.amplizService.getDashboardDetails().subscribe(
			(res) => {
				this.updatedCredits = res.CurrentCredits;
			},
			(error) => {}
		);
	}

	handleSavePress(event) {
		event.stopPropagation();
		if (this.listGroup.valid == true) {
			this.isListFormInValid = false;
			if (this.bulkSaveEnabled) {
				this.bulkSave();
			} else {
				this.addPhysicianToList();
			}
		} else {
			this.isListFormInValid = true;
			setTimeout(() => {
				this.isListFormInValid = false;
			}, 2000);
		}
	}

	bulkSave() {
		const selectedList = this.listGroup.value.select || {};
		if (this.numberOfPhysicians > 0) {
			this.menuTrigger.closeMenu();
			const body = {
				listId: selectedList.listId,
				recordCount: this.numberOfPhysicians,
				searchInput: this.filterParams
			};
			this.loaderService.display(true);
			this.amplizService.savePhysicianAsPerCount(body).subscribe(
				(res) => {
					this.messageService.display(true, 'Successfully added to the list');
					this.listGroup.reset();
					this.successfullyAdded.emit();
					this.menuTrigger.closeMenu();
					this.numberOfPhysicians = 5;
					this.loaderService.display(false);
					this.getDashboardDetails();
				},
				(error) => {
					this.loaderService.display(false);
					// console.log(error.error[0]);
					this.menuTrigger.closeMenu();
					let msg: any = 'Server Error';
					if (error.error[0]) {
						msg = error.error[0].message ? error.error[0].message : 'Error';
					}
					this.messageService.displayError(true, msg || 'Error');
				}
			);
		}
	}

	addPhysicianToList() {
		// console.log(this.selectedItems, "this.selectedItems")
		if (this.selectedItems.length > 0) {
			this.menuTrigger.closeMenu();
			const selectedList = this.listGroup.value.select || {};
			const body = {
				listid: selectedList.listId,
				leadIdList: this.selectedItems,
				leadType: 'Physician'
			};
			this.loaderService.display(true);
			this.amplizService.addLeadsToList(body).subscribe(
				(res) => {
					this.loaderService.display(false);
					this.messageService.display(true, 'Successfully added to the list');
					this.listGroup.reset();
					this.successfullyAdded.emit();
					this.getDashboardDetails();
				},
				(error) => {
					this.loaderService.display(false);
					if (error.error[0]) {
						const msg: any = error.error[0].message ? error.error[0].message : 'Error';
						this.messageService.displayError(true, msg);
					}
				}
			);
		}
	}
	public openItem(path: string): void {
		this.ngZone.run(() => this.router.navigateByUrl(path)).then();
	}

	bulkUploadDataChanged(event) {
		if (this.selectedItems.length > 0) {
			this.bulkSaveEnabled = !this.bulkSaveEnabled;
			this.focusPhysicianInput();
		}
	}

	focusPhysicianInput() {
		setTimeout(() => {
			if (this.physicianInput) {
				this.physicianInput.nativeElement.focus();
			}
		}, 100);
	}
	handleSaveTrigger() {
		this.listGroup.reset();
		if (this.selectedItems.length == 0) {
			this.bulkSaveEnabled = true;
			this.focusPhysicianInput();
		} else {
			this.bulkSaveEnabled = false;
		}
	}
}
