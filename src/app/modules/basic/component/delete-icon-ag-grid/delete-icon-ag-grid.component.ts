import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
@Component({
  selector: "app-delete-icon-ag-grid",
  templateUrl: "./delete-icon-ag-grid.component.html",
  styleUrls: ["./delete-icon-ag-grid.component.css"],
})
export class DeleteIconAgGridComponent implements OnInit {
  private params: any;
  componentParent: any;
  listId: any;
  @Output()
  deleteListEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.listId = this.params.data.listId;
    this.componentParent = this.params.context.componentParent;
  }

  ngOnInit(): void {}

  deleteList() {
    this.componentParent.deleteList(this.listId);
  }
}
