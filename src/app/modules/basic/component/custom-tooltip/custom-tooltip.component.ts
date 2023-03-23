import { Component, OnInit } from "@angular/core";
// import { ICellRendererAngularComp } from "ag-grid-angular";
// import { ICellRendererParams } from "ag-grid-community";
import { ITooltipParams } from "ag-grid-community";
import { ITooltipAngularComp } from "ag-grid-angular";

@Component({
  selector: "app-custom-tooltip",
  templateUrl: "./custom-tooltip.component.html",
  styleUrls: ["./custom-tooltip.component.css"],
})
export class CustomTooltipComponent implements ITooltipAngularComp {
  public params: ITooltipParams;
  listName: any;
  agInit(params: ITooltipParams): void {
    this.params = params;
    this.listName = this.params.value.value;
  }
  constructor() {}

  ngOnInit(): void {}
}
