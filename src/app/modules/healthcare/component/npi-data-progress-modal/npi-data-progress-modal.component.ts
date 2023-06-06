import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-npi-data-progress-modal",
  templateUrl: "./npi-data-progress-modal.component.html",
  styleUrls: ["./npi-data-progress-modal.component.css"],
})
export class NpiDataProgressModalComponent implements OnInit {
  @Input() name: string = "";
  constructor() {}

  ngOnInit() {}
  bookDemo() {
    window.open(
      "https://www.ampliz.com/book-your-demo?utm_source=npi_lookup_enric&utm_medium=banner&utm_campaign=product",
      "_blank"
    );
  }
}
