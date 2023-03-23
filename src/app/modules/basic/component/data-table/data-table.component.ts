import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"],
})
export class DataTableComponent implements AfterViewInit, OnInit {
  @Input() hasEditButton: boolean = false;
  @Input() hasViewButton: boolean = false;
  @Input() hasDeleteButton: boolean = false;
  @Input() headers: any[] = headers;
  @Input() data: any[] = [];
  @Output() linkPressed = new EventEmitter();
  get headerNames() {
    return this.headers.map((item) => {
      return item.name;
    });
  }
  get headerKeys() {
    return this.headers.map((item) => {
      return item.key;
    });
  }
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() {
    const users: any[] = [];

    // Assign the data to the data source for the table to render
    
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    console.log(this.data, this.dataSource);
    if (this.hasEditButton || this.hasDeleteButton || this.hasViewButton) {
      this.headers.push({
        key: "action",
        name: "Action",
        type: "action",
      });
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  itemClicked(header: any,value: any) {
    
    if(header.isLink === true) {
      const body = {
        key: header.key,
        value
      }
      this.linkPressed.emit(body);
    }
  }
}

const headers = [
  {
    key: "productOrderId",
    name: "Product Order Id",
    type: "text",
    className: "col-2",
  },
  {
    key: "productName",
    name: "Product Name",
    type: "text",
  },
  {
    key: "count",
    name: "Count",
    type: "text",
  },
  {
    key: "amount",
    name: "Amount",
    type: "text",
  },
  {
    key: "nameOfCustomer",
    name: "Name of Customer",
    type: "text",
  },
  {
    key: "orderDate",
    name: "Order Date",
    type: "text",
  },
  {
    key: "status",
    name: "Status",
    type: "status",
  },
];

const data = [
  {
    productOrderId: "1",
    productName: "Green Tshirt",
    count: "100",
    amount: 5000,
    nameOfCustomer: "Govi",
    orderDate: "02-05-2022",
    status: "New Order",
    statusColor: "#70D881",
  },
  {
    productOrderId: "2",
    productName: "Red Tshirt",
    count: "10",
    amount: 1000,
    nameOfCustomer: "Bhupen",
    orderDate: "03-05-2022",
    status: "New Order",
    statusColor: "#70D881",
  },
  {
    productOrderId: "3",
    productName: "Blue Tshirt",
    count: "29",
    amount: 2000,
    nameOfCustomer: "Gani",
    orderDate: "05-04-2022",
    status: "New Order",
    statusColor: "#70D881",
  },
  {
    productOrderId: "4",
    productName: "Yellow Tshirt",
    count: "27",
    amount: 4000,
    nameOfCustomer: "Alok",
    orderDate: "02-05-2021",
    status: "New Order",
    statusColor: "#70D881",
  },
  {
    productOrderId: "5",
    productName: "Big Tshirt",
    count: "44",
    amount: 3000,
    nameOfCustomer: "Tony",
    orderDate: "02-07-2021",
    status: "New Order",
    statusColor: "#70D881",
  },
];
