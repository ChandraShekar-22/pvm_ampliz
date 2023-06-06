import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { Router } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';
import { MessageService } from '../../../B2B/services/message.service';
import { NpiActionsComponent } from '../../component/npi-actions/npi-actions.component';
import { NpiDownloadAgainComponent } from '../../component/npi-download-again/npi-download-again.component';
import moment from 'moment';
import 'rxjs/Rx';
import { NpiTableStatusComponent } from '../../component/npi-table-status/npi-table-status.component';

@Component({
  selector: 'app-npi-lookup',
  templateUrl: './npi-lookup.component.html',
  styleUrls: ['./npi-lookup.component.css'],
})
export class NpiLookupComponent implements OnInit {
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  @ViewChild('hideCancelOption', { static: false })
  hideCancelOption: ElementRef;
  columnDefs: any;
  searchString: string;
  createDrawer: boolean = false;
  PageSize: number;
  sortingOrders: any;
  gridApi: any;
  gridColumnApi: any;
  paramsData: any = {};
  datasource: any;
  defaultColDef: any;
  allItems: any[];
  pager: any = { currentPage: 1, offset: 5, totalPages: 1 };
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
  totalCount: number = 0;
  paginationPageSize: number;
  npiQuestion = { npi1: true, npi2: false, npi3: false, npi4: false };

  constructor(
    public amplizService: AmplizService,
    private loaderService: LoaderService,
    private router: Router,
    private pagerservice: PaginationService,
    private messageService: MessageService
  ) {
    this.frameworkComponents = {
      actionRender: NpiActionsComponent,
      downloadRender: NpiDownloadAgainComponent,
      statusRender: NpiTableStatusComponent,
    };
    this.columnDefs = [
      {
        headerName: 'File Name',
        field: 'fileName',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        cellClass: 'cellClass',
        resizable: true,
        lockPosition: true,

        cellRenderer: function (params) {
          return `<a class="listLink_npi" >${
            params.value.length > 20 ? params.value.slice(0, 20) + '...' : params.value
          }</a>`;
        },
        tooltipValueGetter: function (params) {
          if (params.value.length > 20) {
            return params.value;
          }
        },
      },
      {
        headerName: 'Contacts',
        field: 'contactsCount',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        suppressSizeToFit: true,
        resizable: true,
      },
      {
        headerName: 'Status',
        field: 'bulkNpiId',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        sortable: false,
        autoHeight: true,
        cellRenderer: 'statusRender',
        resizable: true,
      },
      {
        headerName: 'Uploaded On',
        field: 'uploadedOn',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        sortable: true,
        autoHeight: true,
        suppressSizeToFit: true,
        cellRenderer: function (params) {
          return params.value ? moment(params.value).format('DD MMM YYYY') : '---';
        },
        resizable: true,
      },
      {
        headerName: 'Re-Download',
        field: 'bulkNpiId',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        sortable: false,
        autoHeight: true,
        cellRenderer: 'downloadRender',
        resizable: true,
        width: 80,
      },
      {
        headerName: 'Action',
        field: 'bulkNpiId',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        sortable: false,
        autoHeight: true,
        cellRenderer: 'actionRender',
        resizable: true,
        width: 60,
      },
    ];
    this.paginationPageSize = 10;
    this.sortingOrders = ['desc', 'asc', null];
    this.PageSize = 5;
    this.defaultColDef = { resizable: true };
    this.totalSize = 5;
  }
  get offset() {
    const total = this.pager.offset * (this.pager.currentPage - 1);
    return +total + 1;
  }

  ngOnInit() {
    this.getUploadFileListNpi();
  }
  exportDownloadAll(ev) {
    ev.data.bulkNpiId;
    this.router.navigate([`/npi-data-card/${ev.data.bulkNpiId}`]);
  }
  onGridReady(params) {
    this.paramsData = params;
    this.gridApi = params.api;

    this.gridColumnApi = params.columnApi;
    this.paramsData.api.setRowData([]);
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.sizeColumnsToFit(allColumnIds);
  }
  onPaginationClick(currentPage) {
    this.pager = { ...this.pager, currentPage };
    this.getUploadFileListNpi();
  }
  getUploadFileListNpi() {
    const skip = (this.pager.currentPage - 1) * this.pager.offset;
    this.amplizService.getUploadFileListNpi(skip, this.pager.offset).subscribe((res) => {
      this.totalCount = res.totalCount;
      this.pager = {
        ...this.pager,
        totalPages: Math.ceil(this.totalCount / this.pager.offset),
      };
      this.paramsData.api.setRowData(res.bulkNpiUploadList);
    });
  }
  get count() {
    const pageCount = this.pager.currentPage * this.pager.offset;
    return this.pager.currentPage === this.pager.totalPages
      ? this.totalCount
      : pageCount > this.totalCount
      ? this.totalCount
      : pageCount;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
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
  cardClick(selected: string) {
    const newOptions = { npi1: false, npi2: false, npi3: false, npi4: false };
    newOptions[selected] = true;
    this.npiQuestion = newOptions;
  }
}
