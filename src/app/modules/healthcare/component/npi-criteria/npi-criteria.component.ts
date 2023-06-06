import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AmplizService } from "../../services/ampliz.service";

@Component({
  selector: "app-npi-criteria",
  templateUrl: "./npi-criteria.component.html",
  styleUrls: ["./npi-criteria.component.css"],
})
export class NpiCriteriaComponent implements OnInit {
  isCollapse: boolean = true;
  bulkNpiId: string = "";
  totalCount: number = 0;
  @Input()
  reportInfo: {
    fileName: string;
    noOfContactAccepted: number;
    noOfContactRejected: number;
    noOfContactUploaded: number;
  } = {
    fileName: "",
    noOfContactAccepted: 0,
    noOfContactRejected: 0,
    noOfContactUploaded: 0,
  };
  constructor(
    private amplizService: AmplizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.bulkNpiId = res.bulkNpiId;
    });
    this.getTotalCount();
  }
  getTotalCount() {
    this.amplizService
      .getEmailCountForNPI(this.bulkNpiId, "all")
      .subscribe((res) => {
        this.totalCount = res.count;
      });
  }
  showPanel() {
    this.isCollapse = !this.isCollapse;
  }
}
