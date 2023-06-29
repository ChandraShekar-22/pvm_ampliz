import { Component, Input, OnInit } from '@angular/core';
import { CustomTooltipComponent } from 'src/app/modules/basic/component/custom-tooltip/custom-tooltip.component';
import { ExportCsvBtnComponent } from 'src/app/modules/basic/component/export-csv-btn/export-csv-btn.component';
import { ButtoncellrendererComponent } from 'src/app/modules/basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { PaginationService } from 'src/app/modules/healthcare/services/pagination.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
	@Input() userInfo: any;
	@Input() isAdmin: boolean;

	gridApi: any;
	gridColumnApi: any;
	paramsData: any = {};
	datasource: any;
	offset: any = 0;
	count: any = 5;
	// Select var
	listItems: any = [
		{
			name: 'My List',
			key: 'Mylist',
			active: true,
		},
		{
			name: 'Team List',
			key: 'TeamList',
			active: false,
		},
	];
	selectValue: string = this.listItems[0].name;
	// Table var
	tabItems = ['All', 'Processing', 'Completed'];
	activeLink = this.tabItems[0];
	searchString: string = '';
	columnDefs: any;
	defaultColDef: any;
	frameworkComponents: any;
	context: any;
	sortingOrders: any;
	// Pagination Var
	paginationPageSize: number;
	pager: any = {};
	pagedItems: any[];
	totalSize: number = 0;

	public domLayout = 'autoHeight';

	constructor(
		private hcApi: AmplizService,
		private pagerservice: PaginationService,
		private messageService: MessageService
	) {
		this.frameworkComponents = {
			buttonRenderer: ButtoncellrendererComponent,
		};
		this.context = {
			componentParent: this,
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
							value: params.value,
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
				},
			},
			{
				headerName: 'Contacts',
				field: 'noOfLeads',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				lockPosition: true,
				sortable: true,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' },
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
				cellStyle: { color: '#515050', fontWeight: '400' },
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
						component: ExportCsvBtnComponent,
					};
					return exportCsv;
				},
			},
		];
		this.defaultColDef = {
			tooltipComponent: CustomTooltipComponent,
		};
		this.paginationPageSize = 10;
		this.sortingOrders = ['desc', 'asc', null];
	}

	handleSelect(index) {
		this.listItems.map((x) => {
			x.active = false;
		});
		this.listItems[index].active = true;
		this.selectValue = this.listItems[index].name;
		const key = this.listItems[index].key;
		this.setPage(0, key);
	}
	onFirstDataRendered(params) {
		params.api.sizeColumnsToFit();
	}
	onGridReady(params, dataSource?: any) {
		this.paramsData = params;
		this.gridApi = params.api;
		this.gridApi.setRowData(10);
		this.gridColumnApi = params.columnApi;
		this.paramsData.api.setRowData(dataSource);
		this.setColumnToFitPage();
	}

	ngOnInit(): void {
		this.setRowData();
	}
	async setRowData() {
		await this.hcApi.getAllList(this.offset, this.count, true).subscribe(
			(res) => {
				this.datasource = res.savedlistInfoList;
				this.paramsData.api.setRowData(this.datasource);
			},
			(error) => {}
		);
	}
	setColumnToFitPage() {
		var allColumnIds = [];
		this.gridColumnApi.getAllColumns().forEach(function (column) {
			allColumnIds.push(column.colId);
		});
		this.gridColumnApi.autoSizeColumns(allColumnIds);
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

	setPage(page: any, listType?: any) {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
		this.hcApi.getAllList(this.offset, this.count, true, listType).subscribe(
			(res) => {
				this.datasource = res.savedlistInfoList;
				this.paramsData.api.setRowData(this.datasource);
				if (this.datasource.length != 0) {
					this.totalSize = res.totalCount;
					//
					this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
					this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
					//
					this.paramsData.api.setRowData(this.datasource);
					// this.loaderService.display(false);
				} else {
					this.paramsData.api.setRowData(this.datasource);
					this.showLoading(false);
				}
			},
			(error) => {}
		);
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
	deleteList(listId: any) {
		this.hcApi.deleteList(listId).subscribe(
			(res) => {
				this.messageService.display(true, 'Selected list successfully deleted');
				this.setRowData();
				this.setPage(1);
			},
			(error) => {
				this.messageService.displayError(true, error.error[0].message);
			}
		);
	}
}
