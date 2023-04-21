import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ICellRendererParams } from "ag-grid-community";
@Component({
  selector: 'app-list-action-button',
  templateUrl: './list-action-button.component.html',
  styleUrls: ['./list-action-button.component.css'],
})
export class ListActionButtonComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog = {} as TemplateRef<any>;
  @Output()
  deleteList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  editListName: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  params?: any;

  componentParent?: any;
  fromListDetail: boolean = false;
  constructor(public dialog: MatDialog) {}
  dialogRef: any;

  ngOnInit(): void {}

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
    if (this.params.from === 'list-detail') {
      this.fromListDetail = true;
    }
  }

  openDialog() {
    if (this.fromListDetail) {
      var message = `Would you like to delete "${this.params.data.name}" lead from the list?`;
    } else {
      var message = `Would you like to delete "${this.params.listName}" list?`;
    }
    this.dialogRef = this.dialog.open(this.confirmDialog, {
      data: {
        message: message,
        buttonText: {
          delete: 'Delete',
          cancel: 'Cancel',
        },
      },
    });
  }

  deleteConfirmed() {
    if (this.fromListDetail) {
      this.deleteLead();
    } else {
      this.removeList();
    }
  }

  deleteLead() {
    this.componentParent.deleteLeadSingle(this.params.data.id);
  }

  removeList() {
    this.deleteList.emit();
    this.dialogRef.close(true);
  }
  editList() {
    this.editListName.emit();
  }
}
