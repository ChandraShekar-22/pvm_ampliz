import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/modules/healthcare/services/pagination.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
	selector: 'app-listdetails',
	templateUrl: './listdetails.component.html',
	styleUrls: ['./listdetails.component.css']
})
export class ListdetailsComponent implements OnInit, AfterViewInit {
	@ViewChild('hideCancelOption') hideCancelOption;
	@ViewChild('hideCancelMultple') hideCancelMultple;
	columnDefs: any;
	paginationPageSize: number;
	sortingOrders: any;
	defaultColDef: any;
	datasource: any;
	paramsData: any = {};
	gridApi: any;
	gridColumnApi: any;
	listId: any;
	offset: any = 0;
	count: any = 5;
	rowHeight = 50;
	parameter: any = {};
	pager: any = {};
	pagedItems: any[];
	totalSize: number;
	showName: boolean = true;
	listName: string;
	userId: string = localStorage.getItem('auth_token');
	selectAllCheck: boolean = false;
	clickedLeadIdList: any = [];
	singleRemoveLead: any = [];
	currentRowLeadId: any;
	rowSelection: any;
	apiUrl: any;
	filterSearch: boolean = false;
	filterData: any;
	subscriptions = [];
	headerData: any = '';
	subscribed: boolean;
	createDrawer: boolean = false;

	isDownload: any = localStorage.getItem('isDownload');

	public user = null;
	constructor(
		public amplizService: AmplizService,
		private loaderService: LoaderService,
		private route: ActivatedRoute,
		private pagerservice: PaginationService,
		private messageService: MessageService
	) {
		this.columnDefs = [
			{
				headerName: '',
				field: 'checkbox',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 50,
				height: 100,
				cellClass: '',
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: true,
				suppressSizeToFit: true,
				pinned: 'left',
				lockPosition: true
			},
			{
				headerName: 'Name',
				field: 'name',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 200,
				height: 100,
				cellClass: 'eCellfirst',
				// headerCheckboxSelectionFilteredOnly: true,
				// checkboxSelection: true,
				suppressSizeToFit: true,
				pinned: 'left',
				lockPosition: true
			},
			{
				headerName: 'Lead Type',
				field: 'leadType',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 200,
				height: 100,
				cellClass: 'eCellfirst',
				// headerCheckboxSelectionFilteredOnly: true,
				// checkboxSelection: true,
				suppressSizeToFit: true,
				pinned: 'left',
				lockPosition: true
			},
			{
				headerName: 'Hospital',
				field: 'hospitalName',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 200,
				cellClass: 'cellClass',

				suppressSizeToFit: true,
				lockPosition: true
			},
			{
				headerName: 'Domain',
				field: 'webaddress',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 250,
				cellClass: 'cellClass',
				suppressSizeToFit: true,
				lockPosition: true,
				resizable: false
			},
			{
				headerName: 'Email',
				field: 'email',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 250,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true,
				resizable: false
			},
			{
				headerName: 'Phone',
				field: 'phoneNumber',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 200,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true
			},
			{
				headerName: 'Mobile Number',
				field: 'mobileNumber',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 200,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true
			},
			{
				headerName: 'Lead Location',
				field: 'leadLocation',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 250,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true
			},
			{
				headerName: 'Lead Title',
				field: 'leadTitle',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 250,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true
			},
			{
				headerName: 'Hospital Phone',
				field: 'hospitalPhone',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 200,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true
			},
			{
				headerName: 'Hospital Location',
				field: 'hospitalLocation',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				width: 250,
				cellClass: 'cellClass',
				lockPosition: true,
				suppressSizeToFit: true
			}
			// {
			//   headerName: "",
			//   field: "delete",
			//   sortingOrder: ["desc", "asc"],
			//   filter: false,
			//   sortable: false,
			//   width: 100,
			//   autoHeight: true,
			//   suppressSizeToFit: true,
			//   cellRenderer: function (params) {
			//     return '<a href="javascript:void(0)" class="deleteIcon" data-toggle="modal" data-target="#confirmDelete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
			//   },
			// },
		];
		this.sortingOrders = ['desc', 'asc', null];
		this.paginationPageSize = 10;
		this.defaultColDef = { resizable: true };
		this.rowSelection = 'multiple';
	}

	onFirstDataRendered(params) {
		params.api.sizeColumnsToFit();
	}
	onGridReady(params) {
		this.paramsData = params;
		this.gridApi = params.api;
		this.rowHeight = 75;

		this.gridColumnApi = params.columnApi;

		// this.amplizService
		//   .getListDetails({
		//     listId: this.listId,
		//     offset: this.offset,
		//     count: this.count,
		//   })
		//   .subscribe(
		//     (res) => {
		//       this.datasource = res.savedlistDataInfoList;
		this.paramsData.api.setRowData(this.datasource);
		// this.gridApi.sizeColumnsToFit();
		//   },
		//   (error) => {}
		// );
	}

	selectAll() {
		this.gridApi.forEachNode((node) => {
			if (this.selectAllCheck) {
				this.addItem(node.data.id);
			} else {
				this.removeItem(node.data.id);
			}
			node.setSelected(this.selectAllCheck);
		});
		this.checkSelectAll();
	}

	addItem(id) {
		if (!this.clickedLeadIdList.includes(id)) {
			this.clickedLeadIdList.push(id);
		}
	}
	removeItem(id) {
		const index = this.clickedLeadIdList.indexOf(id);
		if (index !== -1) {
			this.clickedLeadIdList.splice(index, 1);
		}
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
					if (this.subscriptions[0].SubscriptionType == 'Free') {
						localStorage.setItem('SubscriptionisActive', 'false');
						this.subscribed = false;

						this.headerData = 'Request Pricing';
					}
					if (this.subscriptions[0].SubscriptionType == 'Paid') {
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
	ngOnInit() {
		console.log('IS DOWNLOAD', this.isDownload);
		this.route.params.subscribe((res) => {
			this.listId = res.listId;
		});
		this.setPage(1);
		this.listName = this.getAllList();
		// this.renderDataTable();
	}
	ngAfterViewInit() {
		// this.getDashboardDetails();
	}
	onCellClicked(ev: any) {
		if (ev.column.colId == 'delete') {
			this.currentRowLeadId = ev.data.id;
		}
	}

	onRowSelected(event) {
		// this.clickedLeadIdList = [];
		if (event.node.selected === true) {
			this.addItem(event.data.id);
		}

		if (event.node.selected === false) {
			this.removeItem(event.data.id);
		}
		this.checkSelectAll();
	}

	// onSelectionChanged(event) {

	//

	// }

	renderDataTable() {
		this.amplizService
			.getListDetails({
				listId: this.listId,
				offset: this.offset,
				count: this.count
			})
			.subscribe(
				(res) => {
					this.datasource = res.savedlistDataInfoList;
					this.paramsData.api.setRowData(this.datasource);
					// this.listName = this.getAllList();
				},
				(error) => {}
			);
		// }
	}

	checkSelectAll() {
		this.selectAllCheck = true;
		this.gridApi.forEachNode((node) => {
			const isIncluded = this.clickedLeadIdList.includes(node.data.id);
			if (!isIncluded) {
				this.selectAllCheck = false;
			}
		});
	}

	setPage(page: any) {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		this.offset = this.count * (page - 1);
		if (this.filterSearch == true) {
			this.filterData.offset = this.offset;
			this.filterData.count = this.count;

			this.amplizService.searchLead(this.filterData).subscribe(
				(res: any) => {
					this.datasource = res.savedlistDataInfoList;
					// this.listName = this.getAllList();

					this.totalSize = res.totalCount;
					this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
					this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
					this.paramsData.api.setRowData(this.datasource);
					this.clickedLeadIdList = [];
					this.selectAllCheck = false;
				},
				(error) => {}
			);
		} else {
			this.amplizService
				.getListDetails({
					listId: this.listId,
					offset: this.offset,
					count: this.count
				})
				.subscribe(
					(res) => {
						this.datasource = res.savedlistDataInfoList;
						// this.listName = this.getAllList();
						if (this.datasource.length != 0) {
							this.totalSize = res.totalCount;
							this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
							this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
							if (this.paramsData.api) {
								this.paramsData.api.setRowData(this.datasource);
							}
							if (this.gridApi) {
								this.gridApi.forEachNode((node) => {
									const isIncluded = this.clickedLeadIdList.includes(node.data.id);
									if (!isIncluded) {
										this.selectAllCheck = false;
									}
									node.setSelected(isIncluded);
								});
							}
						} else {
							this.loaderService.display(false);
						}
					},
					(error) => {}
				);
		}
	}

	editName() {
		this.showName = false;
		this.listName = this.getAllList();
	}

	saveLeadName() {
		this.amplizService.saveLeadName(this.listId, this.listName).subscribe((res) => {
			this.showName = true;
		});
	}

	getAllList(): string {
		this.amplizService.getAllList(0, 10000000, true).subscribe((res) => {
			let allList = res.savedlistInfoList;
			let ind = allList.findIndex((x) => x.listId === this.listId);
			this.listName = allList[ind].listName;
		});
		return this.listName;
	}

	cancelBtnClick(ev: any) {
		this.filterSearch = ev;

		// this.renderDataTable();
		this.setPage(1);
	}

	applyBtnClick(ev: any) {
		this.filterSearch = true;
		this.filterData = ev;
		this.offset = this.filterData.offset;
		this.count = this.filterData.count;

		this.setPage(1);
	}

	deleteLeadSingle() {
		this.singleRemoveLead = [];
		this.singleRemoveLead.push(this.currentRowLeadId);

		this.amplizService.removeDataFromList(this.listId, this.singleRemoveLead).subscribe(
			(res) => {
				this.hideCancelOption.nativeElement.click();
				this.messageService.display(true, 'Lead successfully deleted !');
				this.setPage(1);
			},
			(error) => {
				this.hideCancelOption.nativeElement.click();
				this.messageService.displayError(true, 'Something went wrong!');
			}
		);
	}

	deleteLeadMultiple() {
		this.amplizService.removeDataFromList(this.listId, this.clickedLeadIdList).subscribe(
			(res) => {
				this.hideCancelMultple.nativeElement.click();
				this.messageService.display(true, 'Lead successfully deleted !');
				this.setPage(1);
			},
			(error) => {
				this.hideCancelMultple.nativeElement.click();
				this.messageService.displayError(true, 'Something went wrong!');
			}
		);
	}

	downloadAllCsv() {
		if (this.isDownload) {
			this.amplizService.downloadCSVAll(this.listId).subscribe((el) => {
				const a = document.createElement('a');
				const blob = new Blob([el.body], { type: 'text/csv' });
				const url = window.URL.createObjectURL(blob);

				a.href = url;
				a.download = this.listId + '.csv';
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
			});
		} else {
			this.messageService.displayError(
				true,
				'Contact the team admin to get the permissions',
				'Not authorized to download'
			);
		}
	}

	downloadCsv() {
		if (this.isDownload) {
			this.amplizService.downloadExcel(this.listId, this.clickedLeadIdList).subscribe((el) => {
				const a = document.createElement('a');
				const blob = new Blob([el.body], { type: 'text/csv' });
				const url = window.URL.createObjectURL(blob);

				a.href = url;
				a.download = this.listId + '.csv';
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
			});
		} else {
			this.messageService.displayError(
				true,
				'Contact the team admin to get the permissions',
				'Not authorized to download'
			);
		}
	}
}
