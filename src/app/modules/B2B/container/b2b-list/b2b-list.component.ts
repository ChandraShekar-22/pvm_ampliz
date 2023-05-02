import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/modules/healthcare/services/pagination.service';
import { ButtoncellrendererComponent } from 'src/app/modules/basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { B2bService } from '../../services/b2b.service';
import { MessageService } from '../../services/message.service';
import { ExportButtonLoaderComponent } from '../../../basic/component/export-button-loader/export-button-loader.component';
import { DeleteIconAgGridComponent } from 'src/app/modules/basic/component/delete-icon-ag-grid/delete-icon-ag-grid.component';
import { ExportCsvBtnComponent } from 'src/app/modules/basic/component/export-csv-btn/export-csv-btn.component';

import { CustomTooltipComponent } from 'src/app/modules/basic/component/custom-tooltip/custom-tooltip.component';
import { HttpParams } from '@angular/common/http';
import { CellValueChangedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-b2b-list',
  templateUrl: './b2b-list.component.html',
  styleUrls: ['./b2b-list.component.css'],
})
export class B2bListComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('hideCancelOption')
  hideCancelOption: ElementRef;
  @ViewChild('listNameToolTip', { static: true })
  listNameToolTip: TemplateRef<any>;
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
  apiUrl: any;
  leadName: string;
  headerData = '';
  public user = null;
  subscriptions = [];
  editListId: number = null;
  frameworkComponents: any;
  subscribed: boolean;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
  public noRowsTemplate = `"<span">no rows to show</span>"`;

  context: any;
  // gridOptions: any;
  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private pagerservice: PaginationService,
    private b2bService: B2bService,
    private messageService: MessageService
  ) {
    this.context = {
      componentParent: this,
    };
    this.frameworkComponents = {
      buttonRenderer: ButtoncellrendererComponent,
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
        width: 300,
        suppressSizeToFit: true,
        cellStyle: { fontWeight: '500' },
        editable: (params) => params.data.listId == this.editListId,
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
        width: 120,
        lockPosition: true,
        sortable: true,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400' },
      },
      {
        headerName: 'Owner',
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
        headerName: 'Created On',
        field: 'createdOn',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        lockPosition: true,
        autoHeight: true,
        sortable: true,
        width: 180,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400' },
        // cellRenderer: function (params) {
        //   if (params.data.noOfLeads > 0) {
        //     return (
        //       "<div ><a >" +
        //       params.value +
        //       '</a><br/><div class="leads">' +
        //       params.data.noOfLeads +
        //       " Leads</div></div>"
        //     );
        //   } else {
        //     return `<div>${params.value}<br/><div class="leads">${params.data.noOfLeads} Leads</div></div>`;
        //   }
        // },
      },
      {
        headerName: 'Last modified',
        field: 'updatedOn',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        sortable: true,
        autoHeight: true,
        lockPosition: true,
        width: 220,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400' },
        // cellRenderer: function (params) {
        //   return params.value
        //     ? moment(params.value).format('DD MMM YYYY')
        //     : '---';
        // },
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
        // cellRenderer: function (params) {
        //   if (params.data.noOfLeads <= 0) {
        //     return '<a href="javascript:void(0)" class="deleteIcon" data-toggle="modal" data-target="#confirmDelete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
        //   }
        // },
        // cellRendererFramework: ExportCsvBtnComponent ,
        cellRendererSelector: (params) => {
          const loader = {
            component: ExportButtonLoaderComponent,
          };
          const exportCsv = {
            component: ExportCsvBtnComponent,
          };
          if (params.data.noOfLeads <= 0 || params.data.status === 'Completed') {
            return exportCsv;
          }
          if (params.data.status === 'inProgress') {
            return loader;
          }
        },
      },
    ];
    this.sortingOrders = ['desc', 'asc', null];
    this.paginationPageSize = 10;
    this.defaultColDef = {
      resizable: true,
      tooltipComponent: CustomTooltipComponent,
    };
  }
  public domLayout = 'autoHeight';

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
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

  async setRowData() {
    await this.b2bService.getB2bApacList(this.offset, this.count, true).subscribe(
      (res) => {
        this.datasource = res.savedlistInfoList;
        this.paramsData.api.setRowData(this.datasource);
        // this.gridApi.sizeColumnsToFit();
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

  // variables List Tabs
  tabItems = ['All', 'Processing', 'Completed'];
  activeLink = this.tabItems[0];
  currentTab: number = 0;

  ngOnInit() {
    this.setPage(1);
  }

  onPageSizeChanged(ev) {
    let value = ev.target.value;
    this.count = value;
    this.setPage(1);
  }

  renderDataTable() {
    if (this.searchString) {
      this.b2bService.searchB2bApacList(this.searchString, this.offset, this.count).subscribe(
        (res) => {
          this.datasource = res.savedlistInfoList;
          this.paramsData.api.setRowData(this.datasource);
          // this.gridApi.sizeColumnsToFit();
        },
        (error) => {}
      );
    } else {
      this.b2bService.getB2bApacList(this.offset, this.count, true).subscribe(
        (res) => {
          this.datasource = res.savedlistInfoList;
          this.totalSize = res.totalCount;
          this.paramsData.api.setRowData(this.datasource);
          // this.gridApi.sizeColumnsToFit();
        },
        (error) => {}
      );
    }
  }
  onCellClicked(ev) {
    if (ev.column.colId == 'listName') {
      if (ev.data.noOfLeads > 0 && ev.data.status !== 'inProgress') {
        this.router.navigate(['/b2b-list', ev.data.listId, ev.data.listName]);
      }
    }

    if (ev.column.colId == 'delete') {
      this.clickedListId = ev.data.listId;
    }
  }

  downloadAllCsv(body: any) {
    this.loaderService.display(true);
    this.b2bService.exportAllCsv(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        const name = 'contacts' + new Date().toISOString() + '.csv';
        this.b2bService.saveFile(res.body, name);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  setPage(page: any) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // this.loaderService.display(true);
    // this.displayDataInTable()
    // get pager object from service
    this.offset = this.count * (page - 1);
    this.showLoading(true);
    if (this.searchString) {
      this.activeLink = this.tabItems[0];
      this.b2bService.searchB2bApacList(this.searchString, this.offset, this.count).subscribe(
        (res) => {
          this.showLoading(false);
          //
          this.datasource = res.savedlistInfoList;
          //
          if (this.datasource.length != 0) {
            this.totalSize = res.totalCount;
            //
            this.pager = this.pagerservice.getPager(this.totalSize, page, this.count);
            this.pagedItems = this.datasource.slice(this.pager.startIndex, this.pager.endIndex + 1);
            //
            this.paramsData.api.setRowData(this.datasource);
            // this.loaderService.display(false);
          } else {
            this.loaderService.display(false);
          }
        },
        (error) => {}
      );
    } else {
      let status = '';
      if (this.activeLink === this.tabItems[1]) {
        status = 'inProgress';
      } else if (this.activeLink === this.tabItems[2]) {
        status = 'completed';
      }

      this.b2bService.getB2bApacList(this.offset, this.count, true, status).subscribe(
        (res) => {
          this.showLoading(false);
          //
          this.datasource = res.savedlistInfoList;
          //
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
            this.loaderService.display(false);
          }
        },
        (error) => {}
      );
    }
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

  deleteList(listId: any) {
    this.loaderService.display(true);
    this.b2bService.deleteList(listId).subscribe(
      (res) => {
        this.messageService.display(true, 'Selected list successfully deleted');
        this.loaderService.display(false);
        // this.hideCancelOption.nativeElement.click();
        this.renderDataTable();
        this.setPage(1);
      },
      (error) => {
        this.loaderService.display(false);
        this.messageService.displayError(true, error.error[0].message);
        // this.hideCancelOption.nativeElement.click();
      }
    );
  }

  catchEditValue(list?: any) {
    this.editListId = list.listId;
    this.onBtStartEditing();
  }

  onBtStartEditing(key?: string, char?: string) {
    const mapId = this.datasource.map((val, index) => {
      if (val.listId === this.editListId) {
        return index;
      }
    });
    const index = mapId.filter((x) => {
      return typeof x !== 'undefined';
    });
    this.gridApi.startEditingCell({
      rowIndex: index,
      colKey: 'listName',
      key: key,
      charPress: char,
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    if (event.newValue !== '') {
      let oldValue = event.oldValue;
      const obj = {
        listId: this.editListId,
        listName: event.newValue,
      };
      this.editListName(obj);
    }
  }

  editListName(updatedList: any) {
    this.b2bService.editB2bListName(updatedList).subscribe(
      (res) => {
        this.editListId = null;
      },
      (error) => {
        this.gridApi.undoCellEditing();
        this.messageService.displayError(true, error.error[0].message);
      }
    );
  }

  cancelBtnClick(value: boolean) {
    this.createDrawer = value;
    this.renderDataTable();
    this.setPage(1);
  }

  onFilterTextBoxChanged(ev) {
    // this.renderDataTable();
    this.setPage(1);
  }
}
