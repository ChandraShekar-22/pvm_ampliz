import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'src/app/modules/B2B/services/message.service'
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service'
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service'
import { PayorService } from '../../service/payor.service'

@Component({
	selector: 'app-payour-executive-overview',
	templateUrl: './payour-executive-overview.component.html',
	styleUrls: ['./payour-executive-overview.component.css'],
})
export class PayourExecutiveOverviewComponent implements OnInit {
	paramsData: any
	showButtonLoader: boolean = false
	imagingOverviewResult: any
	imagingOverviewData: any
	imagingMoreInfoData: any
	isOverviewAvailable: boolean = true
	isMoreInfoAvailable: boolean = true
	showSaveButton: boolean = false
	saveDrawer: boolean = false
	notCorrectDrawer: boolean = false
	notCorrectReasons: Array<any> = ['Company Name', 'Title', 'Department', 'Seniority', 'Name', 'Location']
	DataResult: Array<any> = []
	currentCredit: any = 0

	constructor(
		private activatedRoute: ActivatedRoute,
		private imagingService: PayorService,
		private messageService: MessageService,
		private loaderService: LoaderService,
		private amplizService: AmplizService
	) {}

	ngOnInit() {
		this.paramsData = this.activatedRoute.snapshot.params['mcoExecutiveId']
		this.getImaginCenterDetails()
		this.getImagingCenterOverviewData()
		this.getImagingMoreInfoData()
	}
	getImaginCenterDetails() {
		this.imagingService.getPayourDetails(this.paramsData).subscribe(
			(res) => {
				this.loaderService.display(false)
				this.imagingOverviewResult = res.mcoExecutiveInfo
				if (res.mcoExecutiveInfo.leadSaveStatus !== 'Saved') {
					this.showSaveButton = true
				} else {
					this.showSaveButton = false
				}
			},
			(err) => {
				this.loaderService.display(false)
			}
		)
	}
	getImagingCenterOverviewData() {
		this.imagingService.getPayourDetails(this.paramsData).subscribe((res) => {
			this.imagingOverviewData = res.MCOExecuteveInfo
			const keys = Object.keys(res.MCOExecuteveInfo)
			this.isOverviewAvailable = true
			keys.forEach((item) => {
				if (
					!this.imagingOverviewData[item] ||
					this.imagingOverviewData[item] == '' ||
					this.imagingOverviewData[item] == null
				) {
					delete this.imagingOverviewData[item]
				}
			})
			if (Object.keys(this.imagingOverviewData).length == 0) {
				this.isOverviewAvailable = false
			}
		})
	}
	getImagingMoreInfoData() {
		// this.imagingService
		//   .getImagingCenterMoreInfo(this.paramsData)
		//   .subscribe((res) => {
		//     this.imagingMoreInfoData = res.imagingCenterMoreInfo;
		//     const keys = Object.keys(res.imagingCenterMoreInfo);
		//     this.isMoreInfoAvailable = true;
		//     keys.forEach((item) => {
		//       if (
		//         !this.imagingMoreInfoData[item] ||
		//         this.imagingMoreInfoData[item] == "" ||
		//         this.imagingMoreInfoData[item] == null
		//       ) {
		//         delete this.imagingMoreInfoData[item];
		//       }
		//     });
		//     if (Object.keys(this.imagingMoreInfoData).length == 0) {
		//       this.isMoreInfoAvailable = false;
		//     }
		//   });
	}
	// get showSaveButton() {
	//        return this.imagingOverviewResult.leadSaveStatus !== "Saved";
	// }
	get saveButtonText() {
		return this.imagingOverviewResult.leadSaveStatus == 'NotSaved' ? 'View' : 'Save'
	}
	viewImagingCenterFromList() {
		const body = {
			mcoExecutiveId: this.imagingOverviewResult.mcoExecutiveId,
		}
		this.showButtonLoader = true
		this.imagingService.viewPayourFromList(body).subscribe(
			(res) => {
				this.messageService.display(true, 'Successfully added to the list')
				this.imagingService.getPayourCenterDetails(this.imagingOverviewResult.mcoExecutiveId).subscribe(
					(overview) => {
						this.showButtonLoader = false
						this.imagingOverviewResult = overview.mcoExecutiveInfo
						if (overview.mcoExecutiveInfo.leadSaveStatus !== 'Saved') {
							this.showSaveButton = true
						}
					},
					(err) => {
						this.showButtonLoader = false
					}
				)
			},
			(err) => {
				this.showButtonLoader = false
			}
		)
	}
	handleSaveButtonPress() {
		const leadSaveStatus = this.imagingOverviewResult.leadSaveStatus
		if (leadSaveStatus == 'NotSaved') {
			this.viewImagingCenterFromList()
		} else {
			this.saveDrawer = true
		}
	}
	cancelBtnClick(value: boolean) {
		this.saveDrawer = value
		this.notCorrectDrawer = value
	}
	refreshedData(ev: any) {
		if (ev === true) {
			this.loaderService.display(true)
			setTimeout(() => {
				this.getImaginCenterDetails()
			}, 200)
		}
	}
	request(request: any) {
		this.loaderService.display(true)
		const body = {
			comid: '0',
			url: window.location.href,
			intentrequest: request,
		}
		this.amplizService.request_access(body).subscribe(
			(res) => {
				this.loaderService.display(false)
				this.messageService.display(true, res.msg)
			},
			(err) => {
				this.loaderService.display(true)
			}
		)
	}
	tabClick(event) {}
}
