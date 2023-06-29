import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
@Component({
	selector: 'app-export-csv-btn',
	templateUrl: './export-csv-btn.component.html',
	styleUrls: ['./export-csv-btn.component.css'],
})
export class ExportCsvBtnComponent implements OnInit {
	componentParent: any;
	params: any;
	constructor() {}
	agInit(params: ICellRendererParams): void {
		this.params = params;
		this.componentParent = this.params.context.componentParent;
	}
	ngOnInit(): void {}

	downloadCSV() {
		const body = {
			listId: this.params.data.listId,
			listName: this.params.data.listName,
		};
		console.log('BODY', body);
		this.componentParent.downloadAllCsv(body);
	}

	deleteList() {
		this.componentParent.deleteList(this.params.data.listId);
	}

	editListName() {
		this.componentParent.catchEditValue(this.params.data);
	}
}
