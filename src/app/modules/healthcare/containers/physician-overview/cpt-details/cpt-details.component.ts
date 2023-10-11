import { Component, OnInit, Input } from '@angular/core';
import { CustomTooltipComponent } from 'src/app/modules/basic/component/custom-tooltip/custom-tooltip.component';
import { CellValueChangedEvent } from 'ag-grid-community';
import { AmplizService } from '../../../services/ampliz.service';

@Component({
	selector: 'app-cpt-details',
	templateUrl: './cpt-details.component.html',
	styleUrls: ['./cpt-details.component.css']
})
export class CptDetailsComponent implements OnInit {
	@Input() physicianId: string;
	alert: boolean = false;
	columnDefs: any;
	searchString: string = '';
	createDrawer: boolean = false;
	paginationPageSize: number;
	sortingOrders: any;
	gridApi: any;
	gridColumnApi: any;
	paramsData: any;
	datasource: any;
	defaultColDef: any;
	allItems: any[];
	pagedItems: any[];
	totalSize: number;
	clickedListId: any;
	frameworkComponents: any;
	subscribed: boolean;
	pager: any = { currentPage: 1, offset: 10, totalPages: 1 };
	totalCount = 0;
	public overlayLoadingTemplate =
		'<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
	public noRowsTemplate = `"<span">no rows to show</span>"`;

	context: any;
	public domLayout = 'autoHeight';
	constructor(public amplizService: AmplizService) {}
	onPaginationClick(currentPage) {
		this.pager = { ...this.pager, currentPage };
		this.getCPTdetails();
	}

	get offset() {
		const total = this.pager.offset * (this.pager.currentPage - 1);
		return +total + 1;
	}

	get count() {
		const pageCount = this.pager.currentPage * this.pager.offset;
		return this.pager.currentPage === this.pager.totalPages
			? this.totalCount
			: pageCount > this.totalCount
			? this.totalCount
			: pageCount;
	}

	ngOnInit(): void {
		this.getCPTdetails();
		this.context = {
			componentParent: this
		};
		this.columnDefs = [
			{ tooltipField: 'col1' },
			{
				headerName: 'Code',
				field: 'cptCode',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				sortable: true,
				lockPosition: true,
				width: 120,
				suppressSizeToFit: true,
				cellStyle: { fontWeight: '500' }
			},
			{
				headerName: 'Description',
				field: 'description',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				width: 400,
				wrapText: true,
				lockPosition: true,
				sortable: true,
				suppressSizeToFit: true,
				cellStyle: {
					color: '#515050',
					fontWeight: '400',
					wordBreak: 'normal',
					// lineHeight: 'unset',
					lineHeight: '20px',
					padding: '10px 0'
				}
			},
			{
				headerName: 'Beneficiaries',
				field: 'beneficiaries',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				autoHeight: true,
				lockPosition: true,
				sortable: true,
				width: 240,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Services Count',
				field: 'servicesCount',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				width: 180,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Number of Beneficiary/Per Day Services',
				field: 'numberOfBeneficiaryOrPerDayServices',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				wrapText: true,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				width: 180,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Avg Submitted Charge Amount',
				field: 'avgSubmittedChargeAmount',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				wrapText: true,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				wrapHeaderText: true,
				width: 180,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Avg Medicare Allowed Amount',
				field: 'avgMedicareAllowedAmount',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				wrapText: true,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				width: 180,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Avg Medicare Payment Amount',
				field: 'avgMedicarePaymentAmount',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				wrapText: true,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				width: 180,
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' }
			},
			{
				headerName: 'Avg Medicare Standardized Payment Amount',
				field: 'avgMedicareStandardizedPaymentAmount',
				sortingOrder: ['desc', 'asc'],
				filter: false,
				wrapText: true,
				headerWrapText: true,
				lockPosition: true,
				autoHeight: true,
				sortable: true,
				width: 180,
				headerClass: 'wrap-header',
				suppressSizeToFit: true,
				cellStyle: { color: '#515050', fontWeight: '400' },
				headerCellStyle: { wordBreak: 'normal', lineHeight: 'unset' }
			}
		];
		this.sortingOrders = ['desc', 'asc', null];
		this.paginationPageSize = 10;
		this.defaultColDef = {
			resizable: true,
			tooltipComponent: CustomTooltipComponent
		};
	}
	onGridReady(params, dataSource?: any) {
		this.paramsData = params;
		this.gridApi = params.api;
		this.gridApi.setRowData(10);
		this.gridColumnApi = params.columnApi;
		this.paramsData.api.setRowData(dataSource);
		// this.setRowData();
		this.setColumnToFitPage();
	}
	setColumnToFitPage() {
		var allColumnIds = [];
		this.gridColumnApi.getAllColumns().forEach(function (column) {
			allColumnIds.push(column.colId);
		});
		this.gridColumnApi.autoSizeColumns(allColumnIds);
	}
	onCellClicked(ev) {
		if (ev.column.colId == 'listName') {
			if (ev.data.noOfLeads > 0 && ev.data.status !== 'inProgress') {
			}
		}

		if (ev.column.colId == 'delete') {
			this.clickedListId = ev.data.listId;
		}
	}
	onFirstDataRendered(params) {
		params.api.sizeColumnsToFit();
	}
	getCPTdetails() {
		const offset = (this.pager.currentPage - 1) * this.pager.offset;
		this.amplizService
			.getCPTDetails({ physicianId: this.physicianId, offset, count: this.pager.offset })
			.subscribe((res: any) => {
				this.paramsData.api.setRowData(res.cptCodeDetailList);
				this.totalCount = res.totalCount;
				this.pager = {
					...this.pager,
					totalPages: Math.ceil(this.totalCount / this.pager.offset)
				};
			});
	}
}
