import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ComponentFactoryResolver,
} from "@angular/core";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from "@angular/router";
import { PaginationService } from "src/app/modules/healthcare/services/pagination.service";
import { B2bService } from "src/app/modules/B2B/services/b2b.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { GridApi } from "ag-grid-community";
import { ContactInfoTooltipComponent } from "src/app/modules/basic/component/contact-info-tooltip/contact-info-tooltip.component";
import { ListActionButtonComponent } from "src/app/modules/basic/component/list-action-button/list-action-button.component";

@Component({
  selector: "app-b2b-list-detail",
  templateUrl: "./b2b-list-detail.component.html",
  styleUrls: ["./b2b-list-detail.component.css"],
})
export class B2bListDetailComponent implements OnInit {
  @ViewChild("hideCancelOption") hideCancelOption;
  @ViewChild("hideCancelMultple") hideCancelMultple;
  columnDefs: any;
  paginationPageSize: number;
  sortingOrders: any;
  defaultColDef: any;
  datasource: any;
  paramsData: any;
  gridApi: any;
  gridColumnApi: any;
  listId: any;
  listNameTemp: any;
  offset: any = 0;
  count: any = 15;
  rowHeight = 50;
  parameter: any = {};
  pager: any = {};
  pagedItems: any[];
  totalSize: number;
  showName: boolean = true;
  listName: string;
  userId: string = localStorage.getItem("auth_token");
  selectAllCheck: boolean = false;
  clickedLeadIdList: any = [];
  singleRemoveLead: any = [];
  currentRowLeadId: any;
  rowSelection: any;
  apiUrl: any;
  filterSearch: boolean = false;
  filterData: any;
  subscriptions = [];
  headerData: any = "";
  subscribed: boolean;
  createDrawer: boolean = false;
  frameworkComponents: any;

  partiallySelected: boolean = false;
  allContactSelected: boolean = false;
  isCheckboxEmpty: boolean = true;
  checkedRowCount: number = 0;

  isLoading: boolean = false;
  context: any;


  public user = null;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
  constructor(
    public amplizService: AmplizService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private pagerservice: PaginationService,
    private b2bService: B2bService,
    private messageService: MessageService
  ) {
      this.frameworkComponents = {
        contactTooltip: ContactInfoTooltipComponent,
    };
    this.columnDefs = [
      {
        headerName: '',
        field: 'checkbox',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        width: 60,
        height: 100,
        cellClass: '',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        suppressSizeToFit: true,
        pinned: 'left',
        lockPosition: true,
      },
      {
        headerName: 'Name',
        field: 'name',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        width: 235,
        height: 100,
        cellClass: 'eCellfirst',
        pinned: 'left',
        suppressSizeToFit: true,
        lockPosition: true,
        cellStyle: { fontWeight: 'bold', fontSize: '12px' },
      },
      {
        headerName: 'Contact Info',
        field: 'email',
        filter: false,
        autoHeight: true,
        sortable: false,
        width: 180,
        height: 100,
        cellClass: 'cellClass',
        lockPosition: true,
        suppressSizeToFit: true,
        cellRendererFramework: ContactInfoTooltipComponent,
      },
      {
        headerName: 'Title',
        field: 'contactTitle',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        width: 240,
        cellClass: 'cellClass',
        lockPosition: true,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400', fontSize: '12px' },
      },
      {
        headerName: 'Company',
        field: 'companyName',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        width: 248,
        cellClass: 'cellClass',
        lockPosition: true,
        suppressSizeToFit: true,
        cellStyle: { color: '#0071EB', fontWeight: '400', fontSize: '12px' },
      },
      {
        headerName: 'Location',
        field: 'contactLocation',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        autoHeight: true,
        sortable: true,
        width: 278,
        cellClass: 'cellClass',
        lockPosition: true,
        suppressSizeToFit: true,
        cellStyle: { color: '#515050', fontWeight: '400', fontSize: '12px' },
      },
      {
        headerName: 'Action',
        field: 'delete',
        sortingOrder: ['desc', 'asc'],
        filter: false,
        sortable: false,
        autoHeight: true,
        width: 85,
        lockPosition: true,
        suppressSizeToFit: true,
        cellRenderer: ListActionButtonComponent,
        cellRendererParams: {
          from: 'list-detail',
        },
      },
    ];
    this.sortingOrders = ["desc", "asc", null];
    this.paginationPageSize = 10;
    this.defaultColDef = { resizable: true };
    this.rowSelection = "multiple";
    this.context = {
      componentParent: this,
    };

  }
  public autoHeight = "autoHeight";

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
  onGridReady(params) {
    this.paramsData = params;
    this.gridApi = params.api;
    this.rowHeight = 75;
    this.gridApi.sizeColumnsToFit();
    this.gridColumnApi = params.columnApi;
    this.paramsData.api.setRowData(this.datasource);
  }

  selectAll() {
    if (this.allContactSelected) {
      this.gridApi.forEachNode((node) => {
        this.removeContacts(node.data.id);
      });
    } else {
      this.gridApi.forEachNode((node) => {
        this.addContacts(node.data.id);
      });
    }
    this.checkSelectAll();
  }

  get getCheckedRow() {
    return this.gridApi.getSelectedRows().length;
  }

  addContacts(id) {
    if (!this.clickedLeadIdList.includes(id)) {
      this.clickedLeadIdList.push(id);
    }
  }
  removeContacts(id) {
    const index = this.clickedLeadIdList.indexOf(id);
    if (index !== -1) {
      this.clickedLeadIdList.splice(index, 1);
    }
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.subscriptions = res.dashoboardInfo.subscriptions;
          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;

            this.headerData = "Upgrade";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
        }
      );
    } else {
      this.amplizService.logout();
    }
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.listId = res.listId;
      this.listNameTemp = res.listName;
    });
    this.setPage(1);
    // this.renderDataTable();
  }

  onRowSelected(event) {
    const checkedRow = this.gridApi.getSelectedRows().length;
    this.checkedRowCount = checkedRow;
    if (checkedRow == 0) {
      this.allContactSelected = false;
      this.partiallySelected = false;
      this.isCheckboxEmpty = true;
    }
    const totalRow = this.gridApi.getDisplayedRowCount();
    if (checkedRow < totalRow && checkedRow > 0) {
      this.partiallySelected = true;
      this.allContactSelected = false;
      this.isCheckboxEmpty = false;
      if (event.node.selected === true) {
        this.addContacts(event.data.id);
      }
      if (event.node.selected === false) {
        this.removeContacts(event.data.id);
      }
    } else if (checkedRow === totalRow) {
      this.partiallySelected = false;
      this.allContactSelected = true;
      this.isCheckboxEmpty = false;
    }
  }

  checkSelectAll() {
    this.allContactSelected = true;
    this.checkedRowCount = this.gridApi.getSelectedRows().length;
    this.gridApi.forEachNode((node) => {
      const isIncluded = this.clickedLeadIdList.includes(node.data.id);
      if (!isIncluded) {
        this.allContactSelected = false;
        this.isCheckboxEmpty = true;
        node.setSelected(false);
      } else {
        node.setSelected(true);
      }
    });
  }

  renderDataTable() {
    this.b2bService
      .getB2bApacDetails({
        listId: this.listId,
        offset: this.offset,
        count: this.count,
        listName: this.listName,
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

  setPage(page: any) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    this.offset = this.count * (page - 1);
    this.showLoading(false);
    if (this.filterSearch == true) {
      this.filterData.offset = this.offset;
      this.filterData.count = this.count;

      this.amplizService.searchLead(this.filterData).subscribe(
        (res: any) => {
          this.datasource = res.savedlistDataInfoList;
          this.showLoading(false);
          // this.listName = this.getAllList();

          this.totalSize = res.totalCount;
          this.pager = this.pagerservice.getPager(
            this.totalSize,
            page,
            this.count
          );
          this.pagedItems = this.datasource.slice(
            this.pager.startIndex,
            this.pager.endIndex + 1
          );
          this.paramsData.api.setRowData(this.datasource);
          this.clickedLeadIdList = [];
        },
        (error) => {}
      );
    } else {
      this.b2bService
        .getB2bApacDetails({
          listId: this.listId,
          offset: this.offset,
          count: this.count,
          listName: this.listName,
        })
        .subscribe(
          (res) => {
            this.datasource = res.savedlistDataInfoList;
            this.showLoading(false);
            if (this.datasource.length != 0) {
              this.totalSize = res.totalCount;
              this.pager = this.pagerservice.getPager(
                this.totalSize,
                page,
                this.count
              );
              this.pagedItems = this.datasource.slice(
                this.pager.startIndex,
                this.pager.endIndex + 1
              );
              this.paramsData.api.setRowData(this.datasource);
            } else {
              this.loaderService.display(false);
            }
            this.selectAllCheck = true;
            this.gridApi.forEachNode((node) => {
              const isIncluded = this.clickedLeadIdList.includes(node.data.id);
              if (!isIncluded) {
                this.selectAllCheck = false;
              }
              node.setSelected(isIncluded);
            });
          },
          (error) => {}
        );
    }
  }

  editName() {
    this.showName = false;
  }

  cancelBtnClick(ev: any) {
    this.filterSearch = ev;
    this.setPage(1);
  }

  applyBtnClick(ev: any) {
    this.filterSearch = true;
    this.filterData = ev;
    this.offset = this.filterData.offset;
    this.count = this.filterData.count;

    this.setPage(1);
  }

  deleteLeadSingle(id?: any) {
    // this.singleRemoveLead = [];
    // this.singleRemoveLead.push(this.currentRowLeadId);
    const deleteId = [id];
    this.amplizService.removeDataFromList(this.listId, deleteId).subscribe(
      (res) => {
        // this.hideCancelOption.nativeElement.click();
        this.messageService.display(true, "Lead successfully deleted !");
        this.setPage(1);
      },
      (error) => {
        // this.hideCancelOption.nativeElement.click();
        this.messageService.displayError(true, "Something went wrong!");
      }
    );
  }

  deleteLeadMultiple() {
    this.amplizService
      .removeDataFromList(this.listId, this.clickedLeadIdList)
      .subscribe(
        (res) => {
          this.hideCancelMultple.nativeElement.click();
          this.messageService.display(true, "Lead successfully deleted !");
          this.setPage(1);
        },
        (error) => {
          this.hideCancelMultple.nativeElement.click();
          this.messageService.displayError(true, "Something went wrong!");
        }
      );
  }

  updateListName(name: any) {
    if (name.length > 0) {
      const body = {
        listId: this.listId,
        listName: this.listName,
        // updatedOn: "01/01/2010",
      };

      // this.b2bService.updateList(body).subscribe((res) => {});
    }
  }

  exportCsv() {
    if (this.clickedLeadIdList.length > 0) {
      if (this.allContactSelected) {
        this.downloadAllCsv();
      } else {
        this.downloadCsv();
      }
    }
  }

  downloadAllCsv() {
    this.isLoading = true;
    let body: any = {
      listId: this.listId,
      listName: this.listNameTemp,
    };
    this.b2bService.exportAllCsv(body).subscribe(
      (res) => {
        const name = "contacts" + new Date().toISOString() + ".csv";
        this.b2bService.saveFile(res.body, name);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      },
      (err) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
        this.messageService.displayError(true, err);
      }
    );
  }

  downloadCsv() {
    this.isLoading = true;
    let body: any = {
      listId: this.listId,
      listName: this.listNameTemp,
      contactIdList: this.clickedLeadIdList,
    };
    this.b2bService.exportSelectedCsv(body).subscribe(
      (res) => {
        const name = "contacts" + new Date().toISOString() + ".csv";
        this.b2bService.saveFile(res.body, name);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      },
        (err) => {
          setTimeout(() => {
            this.isLoading = false;
          }, 100);
          this.messageService.displayError(true, err);
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
  goBackToList() {
    this.router.navigate(["b2b-list"]);
  }
}
