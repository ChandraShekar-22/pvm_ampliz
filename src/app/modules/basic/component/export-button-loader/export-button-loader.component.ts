import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
@Component({
  selector: "app-export-button-loader",
  templateUrl: "./export-button-loader.component.html",
  styleUrls: ["./export-button-loader.component.css"],
})
export class ExportButtonLoaderComponent implements ICellRendererAngularComp {
  private params: any;
  label: string;
  constructor() {}

  ngOnInit(): void {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.label = this.params.label || null;
  }
  refresh(params?: any): boolean {
    return true;
  }
}
