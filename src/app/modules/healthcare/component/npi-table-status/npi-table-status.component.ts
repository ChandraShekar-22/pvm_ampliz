import { Component, Input, OnInit } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { AmplizService } from "../../services/ampliz.service";

@Component({
  selector: "app-npi-table-status",
  templateUrl: "./npi-table-status.component.html",
  styleUrls: ["./npi-table-status.component.css"],
})
export class NpiTableStatusComponent implements OnInit {
  params: any;
  constructor(public amplizService: AmplizService) {}

  ngOnInit() {}
  agInit(params: ICellRendererParams) {
    this.params = params;
  }
  get matchStatus() {
    return this.params.data.matchingStatus;
  }
}
