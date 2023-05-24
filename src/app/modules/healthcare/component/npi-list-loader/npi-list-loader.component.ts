import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-npi-list-loader",
  templateUrl: "./npi-list-loader.component.html",
  styleUrls: ["./npi-list-loader.component.css"],
})
export class NpiListLoaderComponent implements OnInit {
  itemData: number[] = [1, 2, 3, 4, 5, 6];

  constructor() {}

  ngOnInit() {}
}
