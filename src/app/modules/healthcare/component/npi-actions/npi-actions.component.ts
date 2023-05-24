import { Component, OnInit, ElementRef, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererParams } from "ag-grid-community";
import { AmplizService } from "../../services/ampliz.service";
import { Papa } from "ngx-papaparse";

@Component({
  selector: "app-npi-actions",
  templateUrl: "./npi-actions.component.html",
  styleUrls: ["./npi-actions.component.css"],
})
export class NpiActionsComponent implements OnInit {
  showMore: boolean = false;
  params: any = {};
  showAllClick() {
    this.showMore = !this.showMore;
  }

  constructor(
    private eRef: ElementRef,
    private router: Router,
    public amplizService: AmplizService
  ) {}
  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  ngOnInit() {}
  @HostListener("document:click", ["$event"])
  clickout(event: { target: any }) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.showMore = false;
    }
  }
  get matchStatus() {
    return this.params.data.matchingStatus;
  }
  navigateToReport() {
    if (this.params.data.bulkNpiId)
      this.router.navigate([`/npi-data-card/${this.params.data.bulkNpiId}`]);
  }
  downloadData() {
    this.amplizService
      .downloadPhysicianDataPDF(this.params.data.bulkNpiId)
      .subscribe(
        (res) => {
          const linkSource = `data:application/pdf;base64,${res.pdfBase64}`;
          const downloadLink = document.createElement("a");
          const fileName = this.params.data.fileName.slice(0, -4) + ".pdf";

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // this.params.data.fileName

  bookDemo() {
    window.open(
      "https://www.ampliz.com/book-your-demo?utm_source=npi_lookup_enric&utm_medium=banner&utm_campaign=product",
      "_blank"
    );
  }
}
