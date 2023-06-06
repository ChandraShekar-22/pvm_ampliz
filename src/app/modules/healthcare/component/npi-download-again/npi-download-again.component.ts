import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { AmplizService } from "../../services/ampliz.service";

@Component({
  selector: "app-npi-download-again",
  templateUrl: "./npi-download-again.component.html",
  styleUrls: ["./npi-download-again.component.css"],
})
export class NpiDownloadAgainComponent implements OnInit {
  params: any = {};
  downloadOptions = [];
  downloadData = {
    all: "Download all",
    withemail: "Download with emails",
    withoutemail: "Download without email",
    withphone: "Download with phone",
    withoutphone: "Download without phone",
  };
  constructor(private router: Router, public amplizService: AmplizService) {}

  ngOnInit() {
    this.downloadAgainList();
  }
  downloadAgainList() {
    this.downloadOptions = this.params.data.reDownloadList;
  }
  download(filter) {
    this.amplizService
      .npiDownloadAgain(
        this.params.data.bulkNpiId,
        filter,
        this.params.data.fileName
      )
      .subscribe((res) => {
        const csvdata = "data:text/csv;charset=utf-8," + res;
        var encodedUri = encodeURI(csvdata);

        const anchor = document.createElement("a");
        anchor.href = encodedUri;
        anchor.download = `${this.params.data.fileName}`;
        anchor.click();
        anchor.remove();
      });
  }

  agInit(params: ICellRendererParams) {
    this.params = params;
  }
}
