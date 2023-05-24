import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AmplizService } from "../../services/ampliz.service";

@Component({
  selector: "app-npi-custom-data",
  templateUrl: "./npi-custom-data.component.html",
  styleUrls: ["./npi-custom-data.component.css"],
})
export class NpiCustomDataComponent implements OnInit {
  isCollapse: boolean = true;
  bulkNpiId: string = "";
  totalCount: number = 0;
  constructor(
    private amplizService: AmplizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
  getTotalCount() {}
  showPanel() {
    this.isCollapse = !this.isCollapse;
  }
  onButtonClick() {
    window.open(
      "https://www.ampliz.com/book-your-demo?utm_source=npi_lookup_enric&utm_medium=banner&utm_campaign=product",
      "_blank"
    );
  }
}
