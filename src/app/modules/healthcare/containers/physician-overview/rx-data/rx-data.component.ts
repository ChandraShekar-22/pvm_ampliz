import { Component, OnInit } from '@angular/core';
import { CustomTooltipComponent } from 'src/app/modules/basic/component/custom-tooltip/custom-tooltip.component';
import { CellValueChangedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-rx-data',
  templateUrl: './rx-data.component.html',
  styleUrls: ['./rx-data.component.css'],
})
export class RxDataComponent implements OnInit {
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
  offset: any = 0;
  count: any = 15;
  defaultColDef: any;
  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  totalSize: number;
  clickedListId: any;
  frameworkComponents: any;
  subscribed: boolean;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
  public noRowsTemplate = `"<span">no rows to show</span>"`;

  context: any;
  public domLayout = 'autoHeight';
  constructor() {}

  ngOnInit(): void {
    this.context = {
      componentParent: this,
    };
    this.columnDefs = [
      { tooltipField: 'col1' },
      {
        headerName: 'Drug Name',
        field: 'listName',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        lockPosition: true,
        width: 300,
        suppressSizeToFit: true,
        cellStyle: { fontWeight: '500' },
      },
      {
        headerName: 'Total Claim',
        field: 'noOfLeads',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        width: 120,
        lockPosition: true,
        sortable: true,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400' },
      },
      {
        headerName: 'Total Drug Cost',
        field: 'createdBy',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        lockPosition: true,
        sortable: true,
        width: 240,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400' },
      },
      {
        headerName: 'Total Drug Cost For 65+',
        field: 'createdOn',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        lockPosition: true,
        autoHeight: true,
        sortable: true,
        width: 180,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400' },
      },
    ];
    this.sortingOrders = ['desc', 'asc', null];
    this.paginationPageSize = 10;
    this.defaultColDef = {
      resizable: true,
      tooltipComponent: CustomTooltipComponent,
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
}
