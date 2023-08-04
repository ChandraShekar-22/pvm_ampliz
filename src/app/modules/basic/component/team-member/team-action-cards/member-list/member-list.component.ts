import { Component, Input, OnInit } from '@angular/core';
import { CustomTooltipComponent } from 'src/app/modules/basic/component/custom-tooltip/custom-tooltip.component';
import { ExportCsvBtnComponent } from 'src/app/modules/basic/component/export-csv-btn/export-csv-btn.component';
import { ButtoncellrendererComponent } from 'src/app/modules/basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { PaginationService } from 'src/app/modules/healthcare/services/pagination.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { GridOptions } from 'ag-grid-community';

@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.css'],
	animations: [
		trigger('enterAnimation', [
			transition(':enter', [
				style({ transform: 'translateY(10%)', opacity: 0.5 }),
				animate('300ms', style({ transform: 'translateY(0)', opacity: 1 }))
			])
		])
	]
})
export class MemberListComponent implements OnInit {
	@Input() userInfo: any;
	@Input() isAdmin: boolean = undefined;

	// General var
	loader: boolean = false;
	isListEmpty: boolean = false;

	// Select var
	listItems: any = [
		{
			name: 'My List',
			key: 'Mylist',
			active: true
		},
		{
			name: "My Team's List",
			key: 'TeamList',
			active: false
		}
	];

	// Filter var
	selectValue: string = this.listItems[0].name;

	// Table var
	gridApi: any;
	gridColumnApi: any;
	paramsData: any = {};
	datasource: any;
	column: any;
	offset: any = 0;
	count: any = 5;
	tabItems = ['All', 'Processing', 'Completed'];
	activeLink = this.tabItems[0];
	searchString: string = '';
	columnDefs: any;
	defaultColDef: any;
	frameworkComponents: any;
	context: any;
	sortingOrders: any;
	loadingTemplate: any;
	noRowsTemplate: any;
	// Pagination Var
	paginationPageSize: number;
	pager: any = {};
	pagedItems: any[];
	totalSize: number = 0;

	leadWidth: any = '';
	showCreatedBy: boolean = false;

	public domLayout = 'autoHeight';

	constructor(
		private hcApi: AmplizService,
		private pagerservice: PaginationService,
		private messageService: MessageService,
		private api: BasicService
	) {
		this.loadingTemplate = `<span class="ag-overlay-loading-center">data is loading...</span>`;
		this.noRowsTemplate = `"<span">no rows to show</span>"`;
		this.frameworkComponents = {
			buttonRenderer: ButtoncellrendererComponent
		};
		this.context = {
			componentParent: this
		};
		this.columnDefs = [
			{ tooltipField: 'col1' },
			{
				headerName: 'List name',
				field: 'listName',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				lockPosition: true,
				suppressSizeToFit: true,
				cellStyle: { fontWeight: '500', fontSize: '10px' },
				tooltipComponent: CustomTooltipComponent,
				tooltipValueGetter: function (params) {
					if (params.value.length > 20) {
						return {
							value: params.value
						};
					}
				},
				cellRenderer: function (params) {
					let listName = params.value;
					if (params.value.length > 20) {
						let trimmedStr = listName;
						trimmedStr = params.value.substring(0, 20);
						const shortStr = trimmedStr + '...';
						listName = shortStr;
						// return "<span>" + shortStr + "</span>";
					}
					return '<span style="color: #0071eb">' + listName + '<br/></span>';
				}
			},
			{
				headerName: 'Contacts',
				field: 'noOfLeads',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				lockPosition: true,
				sortable: true,
				width: 100,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Created On',
				field: 'createdOn',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Created By',
				field: 'createdBy',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				// hide: this.showCreatedBy,
				suppressSizeToFit: true,
				cellStyle: {
					color: '#515050',
					fontWeight: '400'
				}
			},

			{
				headerName: 'Action',
				field: 'delete',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				sortable: false,
				autoHeight: true,
				lockPosition: true,
				suppressSizeToFit: true,
				width: 80,
				cellRendererSelector: (params) => {
					const exportCsv = {
						component: ExportCsvBtnComponent
					};
					return exportCsv;
				}
			}
		];
		this.defaultColDef = {
			tooltipComponent: CustomTooltipComponent
		};
		this.paginationPageSize = 10;
		this.sortingOrders = ['desc', 'asc', null];
	}

	onFirstDataRendered(params) {
		params.api.sizeColumnsToFit();
	}
	onGridReady(params, dataSource?: any) {
		this.paramsData = params;
		this.gridApi = params.api;
		this.gridApi.sizeColumnsToFit();
		this.paramsData.api.setRowData(dataSource);
		this.gridColumnApi = params.columnApi;
		this.column = this.gridApi.getColumnDefs();
	}

	ngOnInit(): void {}
	ngAfterViewInit() {}
	ngOnChanges() {
		if (this.isAdmin !== undefined) {
			this.setLoader(true);
			this.setPage(1);
		}
	}

	getWidth() {
		return this.listItems[0].active === true ? '' : 40;
	}
	hideCreatedBy() {
		return this.listItems[0].active === true ? true : false;
	}

	handleFilter(index) {
		const key = this.listItems[index].key;
		this.setPage(0, key);
	}

	setPage(page: any, listType?: any) {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		if (this.isAdmin) {
			this.hcApi.getAllList(this.offset, this.count, true, listType).subscribe(
				(res) => {
					this.datasource = res.savedlistInfoList;
					if (this.datasource.length != 0) {
						this.isListEmpty = false;
						if (listType !== undefined) {
							this.listItems.map((x) => {
								x.active = false;
							});
							const index = this.listItems.findIndex((item) => item.key === listType);
							this.listItems[index].active = true;

							// if (this.listItems[0].active == true) {
							// 	var widthNode = this.gridApi.getDisplayedRowAtIndex(0);
							// 	var CreateByNode = this.gridApi.getDisplayedRowAtIndex(3);
							// 	widthNode.setDataValue('width', '');
							// 	CreateByNode.setDataValue('hide', false);
							// 	// this.gridApi.getColumnDefs();
							// 	// this.column[1].width = '';
							// 	// this.column[3].hide = false;
							// 	// this.showCreatedBy = false;
							// } else {
							// 	var widthNode = this.gridApi.getDisplayedRowAtIndex(0);
							// 	var CreateByNode = this.gridApi.getDisplayedRowAtIndex(3);
							// 	widthNode.setDataValue('width', 40);
							// 	CreateByNode.setDataValue('hide', true);

							// 	// this.column[1].width = 40;
							// 	// this.column[3].hide = true;
							// 	// this.leadWidth = 40;
							// 	// this.showCreatedBy = true;
							// }
						}
						// console.log('GRID OPTIONS', this.gridApi.getColumnDefs());
						//
						this.totalSize = res.totalCount;
						//
						this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
						this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
						this.setLoader(false);
						setTimeout(() => {
							this.paramsData.api.setRowData(this.datasource);
						}, 400);
						//
					} else {
						this.listItems.map((x) => {
							x.active = false;
						});
						const index = this.listItems.findIndex((item) => item.key === listType);
						this.listItems[index].active = true;
						this.isListEmpty = true;
						this.setLoader(false);
					}
				},
				(error) => {
					this.setLoader(false);
				}
			);
		} else {
			this.api.getUserList(this.offset, this.count, this.userInfo.userId).subscribe(
				(res) => {
					this.datasource = res.savedlistInfoList;
					if (this.datasource.length != 0) {
						this.isListEmpty = false;
						this.totalSize = res.totalCount;
						//
						this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
						this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
						//
						this.setLoader(false);
						setTimeout(() => {
							this.paramsData.api.setRowData(this.datasource);
						}, 400);
					} else {
						this.isListEmpty = true;
						this.setLoader(false);
					}
				},
				(error) => {
					this.setLoader(false);
				}
			);
		}
	}

	downloadAllCsv(body: any) {
		this.hcApi.downloadCSVAll(body.listId).subscribe((el) => {
			const a = document.createElement('a');
			const blob = new Blob([el.body], { type: 'text/csv' });
			const url = window.URL.createObjectURL(blob);

			a.href = url;
			a.download = body.listName + '.csv';
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
		});
	}

	setLoader(loader: boolean) {
		if (loader == true) {
			this.loader = loader;
		} else {
			setTimeout(() => {
				this.loader = loader;
			}, 300);
		}
	}
}
