import { Component, Input, OnInit } from '@angular/core';
import { CustomTooltipComponent } from 'src/app/modules/basic/component/custom-tooltip/custom-tooltip.component';
import { ExportCsvBtnComponent } from 'src/app/modules/basic/component/export-csv-btn/export-csv-btn.component';
import { ButtoncellrendererComponent } from 'src/app/modules/basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';

@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
	@Input() userInfo: any;
	@Input() isAdmin: boolean;

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
	public domLayout = 'autoHeight';

	constructor() {
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
				cellStyle: { fontWeight: '500' },
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

					if (params.data.status === 'inProgress' || params.data.noOfLeads <= 0) {
						return '<span>' + listName + '<br/></span>';
					} else {
						return '<div class="listLink"><a href="javascript:void(0)">' + listName + '</a><br/><div>';
					}
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
				cellRendererSelector: (params) => {
					const exportCsv = {
						component: ExportCsvBtnComponent,
					};
				},
			},
		];
		this.defaultColDef = {
			resizable: true,
			tooltipComponent: CustomTooltipComponent,
		};
	}

	handleSelect(index) {
		this.listItems.map((x) => {
			x.active = false;
		});
		this.listItems[index].active = true;
		this.selectValue = this.listItems[index].name;
	}

	ngOnInit(): void {}
}
