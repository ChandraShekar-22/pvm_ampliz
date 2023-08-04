import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';
import 'rxjs/Rx';
import { ButtoncellrendererComponent } from '../../../basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { MessageService } from '../../../B2B/services/message.service';
@Component({
	selector: 'app-lists',
	templateUrl: './lists.component.html',
	styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('hideCancelOption')
	hideCancelOption: ElementRef;
	columnDefs: any;
	searchString: string;
	createDrawer: boolean = false;
	paginationPageSize: number;
	sortingOrders: any;
	gridApi: any;
	gridColumnApi: any;
	paramsData: any = {};
	datasource: any;
	offset: any = 0;
	count: any = 5;
	defaultColDef: any;
	allItems: any[];
	pager: any = {};
	pagedItems: any[];
	totalSize: number;
	clickedListId: any;
	apiUrl: any;
	leadName: string;
	headerData = '';
	public user = null;
	subscriptions = [];
	frameworkComponents: any;
	subscribed: boolean;

	isDownload: boolean = false;

	// return '<div class="listLink"><a href="javascript:void(0)">'+ params.value + '</a><br/><div class="leads">'+params.data.noOfLeads+' Leads</div></div>';
	constructor(
		public amplizService: AmplizService,
		private loaderService: LoaderService,
		private router: Router,
		private pagerservice: PaginationService,
		private messageService: MessageService
	) {
		this.frameworkComponents = {
			buttonRenderer: ButtoncellrendererComponent
		};
		this.columnDefs = [
			{
				headerName: 'Name',
				field: 'listName',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 250,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true,
				cellRenderer: function (params) {
					if (params.data.noOfLeads > 0) {
						return (
							'<div class="listLink"><a href="javascript:void(0)">' +
							params.value +
							'</a><br/><div class="leads">' +
							params.data.noOfLeads +
							' Leads</div></div>'
						);
					} else {
						return `<div class="listLink">${params.value}<br/><div class="leads">${params.data.noOfLeads} Leads</div></div>`;
					}
				}
			},
			{
				headerName: 'Created By',
				field: 'createdBy',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				width: 250,
				lockPosition: true,
				sortable: true,
				suppressSizeToFit: true
			},
			{
				headerName: 'Created On',
				field: 'createdOn',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				width: 250,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				suppressSizeToFit: true,
				cellRenderer: function (params) {
					return params.value ? moment(params.value).format('DD MMM YYYY') : '---';
				}
			},
			{
				headerName: 'Updated On',
				field: 'updatedOn',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				width: 250,
				sortable: true,
				autoHeight: true,
				lockPosition: true,
				suppressSizeToFit: true,
				cellRenderer: function (params) {
					return params.value ? moment(params.value).format('DD MMM YYYY') : '---';
				}
			},

			{
				headerName: '',
				field: 'export',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				sortable: false,
				width: 150,
				autoHeight: true,
				lockPosition: true,
				suppressSizeToFit: true,
				cellRenderer: 'buttonRenderer',
				cellRendererParams: {
					clicked: this.exportDownloadAll.bind(this)
				}
			},
			{
				headerName: '',
				field: 'delete',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				sortable: false,
				width: 100,
				autoHeight: true,
				lockPosition: true,
				suppressSizeToFit: true,
				cellRenderer: function (params) {
					if (params.data.noOfLeads <= 0) {
						return '<a href="javascript:void(0)" class="deleteIcon" data-toggle="modal" data-target="#confirmDelete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
					}
				}
			}
		];
		this.sortingOrders = ['desc', 'asc', null];
		this.paginationPageSize = 10;
		this.defaultColDef = { resizable: true };
	}

	onFirstDataRendered(params) {
		params.api.sizeColumnsToFit();
	}
	onGridReady(params) {
		this.paramsData = params;
		this.gridApi = params.api;

		this.gridColumnApi = params.columnApi;
		// this.amplizService.getAllList(this.offset, this.count).subscribe(
		//   (res) => {
		//     this.datasource = res.savedlistInfoList;
		this.paramsData.api.setRowData(this.datasource);
		// this.gridApi.sizeColumnsToFit();
		//   },
		//   (error) => {}
		// );
	}

	ngOnInit() {
		//  this.renderDataTable();
		this.getDashboardDetails();
		this.setPage(1);
	}

	onPageSizeChanged(ev) {
		var value = ev.target.value;
		this.count = value;
		this.setPage(1);
	}

	renderDataTable() {
		if (this.searchString) {
			this.amplizService.searchList(this.searchString, this.offset, this.count).subscribe(
				(res) => {
					this.datasource = res.savedlistInfoList;
					this.paramsData.api.setRowData(this.datasource);
					// this.gridApi.sizeColumnsToFit();
				},
				(error) => {}
			);
		} else {
			this.amplizService.getAllList(this.offset, this.count, true).subscribe(
				(res) => {
					this.datasource = res.savedlistInfoList;
					this.paramsData.api.setRowData(this.datasource);
					// this.gridApi.sizeColumnsToFit();
				},
				(error) => {}
			);
		}
	}

	cancelBtnClick(value: boolean) {
		this.createDrawer = value;
		this.renderDataTable();
		this.setPage(1);
	}

	onCellClicked(ev) {
		if (ev.column.colId == 'listName') {
			if (ev.data.noOfLeads > 0) {
				this.router.navigate(['/lists', ev.data.listId]);
			}
		}

		if (ev.column.colId == 'delete') {
			this.clickedListId = ev.data.listId;
		}
	}

	exportDownloadAll(ev) {
		if (this.isDownload) {
			this.clickedListId = ev.data.listId;
			this.downloadAllCsv(this.clickedListId);
			this.clickedListId = ev.data.listId;
		} else {
			this.messageService.displayError(
				true,
				'Contact the team admin to get the permissions',
				'Not authorized to download'
			);
		}
	}

	downloadAllCsv(listId) {
		this.amplizService.downloadCSVAll(listId).subscribe((el) => {
			const a = document.createElement('a');
			const blob = new Blob([el.body], { type: 'text/csv' });
			const url = window.URL.createObjectURL(blob);

			a.href = url;
			a.download = listId + '.csv';
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
		});
	}

	showLoading(show) {
		if (this.gridApi) {
			if (show) {
				this.gridApi.showLoadingOverlay();
			} else {
				this.gridApi.hideOverlay();
			}
		}
	}

	setPage(page: any) {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		this.showLoading(true);
		// this.displayDataInTable()
		// get pager object from service
		this.offset = this.count * (page - 1);
		if (this.searchString) {
			this.amplizService.searchList(this.searchString, this.offset, this.count).subscribe(
				(res) => {
					this.showLoading(false);
					this.datasource = res.savedlistInfoList;
					if (this.datasource.length != 0) {
						this.totalSize = res.totalCount;
						this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
						this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
						//
						this.paramsData.api.setRowData(this.datasource);
					} else {
					}
				},
				(error) => {}
			);
		} else {
			this.amplizService.getAllList(this.offset, this.count, true).subscribe(
				(res) => {
					this.showLoading(false);
					this.datasource = res.savedlistInfoList;
					//
					if (this.datasource.length != 0) {
						this.totalSize = res.totalCount;
						//
						this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
						this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
						//
						if (this.paramsData.api) {
							this.paramsData.api.setRowData(this.datasource);
						}
						// this.loaderService.display(false);
					} else {
						this.loaderService.display(false);
					}
				},
				(error) => {
					this.showLoading(false);
				}
			);
		}
	}

	deleteList() {
		this.loaderService.display(true);
		this.amplizService.deleteList(this.clickedListId).subscribe(
			(res) => {
				this.messageService.display(true, 'Selected list successfully deleted');
				this.loaderService.display(false);
				this.hideCancelOption.nativeElement.click();
				this.renderDataTable();
				this.setPage(1);
			},
			(error) => {
				this.loaderService.display(false);
				this.messageService.displayError(true, error.error[0].message);
				this.hideCancelOption.nativeElement.click();
			}
		);
	}

	onFilterTextBoxChanged(ev) {
		this.renderDataTable();
		this.setPage(1);
	}

	async getDashboardDetails() {
		const authToken = await localStorage.getItem('auth_token');
		// const userId = await localStorage.getItem('user_id');
		const refreshToken = await localStorage.getItem('refresh_token');
		//
		if (authToken !== null && refreshToken !== null) {
			this.amplizService.getDashboardDetails().subscribe(
				(res) => {
					this.subscriptions = res.Subscriptions;
					this.isDownload = res.isDownload;
					localStorage.setItem('isDownload', res.isDownload);
					if (this.subscriptions[0].SubscriptionType == 'Free') {
						localStorage.setItem('SubscriptionisActive', 'false');
						this.subscribed = false;

						this.headerData = 'Request Pricing';
					}
					if (this.subscriptions[0].SubscriptionType == 'Paid') {
						//
						localStorage.setItem('SubscriptionisActive', 'true');
						this.subscribed = true;
					}
				},
				(error) => {
					if (error.status === 401) {
						this.amplizService.logout();
					}
					//
				}
			);
		} else {
			this.amplizService.logout();
		}
	}
}
