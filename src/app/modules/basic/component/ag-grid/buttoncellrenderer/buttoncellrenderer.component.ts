import { Component, OnInit } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: "app-buttoncellrenderer",
  templateUrl: "./buttoncellrenderer.component.html",
  styleUrls: ["./buttoncellrenderer.component.css"],
})
export class ButtoncellrendererComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
    //
  }
  refresh(params?: any): boolean {
    return true;
  }

  btnClickedHandler() {
    this.params.clicked(this.params);
  }

  ngOnDestroy() {
    // no need to remove the button click handler
    // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
  }
}
