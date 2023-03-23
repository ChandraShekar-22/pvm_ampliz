import { Component, OnInit } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-contact-info-tooltip",
  templateUrl: "./contact-info-tooltip.component.html",
  styleUrls: ["./contact-info-tooltip.component.css"],
})
export class ContactInfoTooltipComponent implements OnInit {
  params: any;
  email: string;
  phone: string;
  linkedIn: string;
  constructor() {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {
    this.email = this.params.data.email;
    this.phone = this.params.data.phoneNumber;
    this.linkedIn = this.params.data.linkedin_Uri;
  }
  openDialog() {}
}
