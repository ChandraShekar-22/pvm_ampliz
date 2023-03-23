import { Component, OnInit } from "@angular/core";
import { AmplizService } from "../../../healthcare/services/ampliz.service";
import { LoaderService } from "../../../healthcare/services/loader.service";
import * as fileSaver from "file-saver";
import { AngularCsv } from "angular7-csv/dist/Angular-csv";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.css"],
})
export class ContactsComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {};

  contactDetails = [];
  public headerData;
  public user = null;

  subscriptions = [];
  subscribed: boolean;
  constructor(
    private amplizService: AmplizService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.getDashboardDetails();
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 2,
    };

    this.getContactDetail();
  }
  async getDashboardDetails() {
    const authToken = await localStorage.getItem("auth_token");
    // const userId = await localStorage.getItem('user_id');
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getDashboardDetails().subscribe(
        (res) => {
          this.subscriptions = res.Subscriptions;

          if (this.subscriptions[0].SubscriptionType == "Free") {
            localStorage.setItem("SubscriptionisActive", "false");
            this.subscribed = false;
            //
            this.headerData = "Upgrade";
          }
          if (this.subscriptions[0].SubscriptionType == "Paid") {
            //
            localStorage.setItem("SubscriptionisActive", "true");
            this.subscribed = true;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.amplizService.logout();
          }
          //
        }
      );
    } else {
      this.amplizService.logout();
    }
  }
  async getContactDetail() {
    // this.loaderService.display(true);
    const authToken = await localStorage.getItem("auth_token");
    const refreshToken = await localStorage.getItem("refresh_token");
    //
    if (authToken !== null && refreshToken !== null) {
      this.amplizService.getContactDetails().subscribe(
        (res) => {
          this.loaderService.display(false);
          this.contactDetails = res.Favorites ? res.Favorites : [];
          //
          this.dtOptions = {
            pageLength: 9,
            // autoWidth: true,
            // stateSave: false,
            // data: this.contactDetails,
          };
        },
        (error) => {
          if (error.status === 401 || 422) {
            this.amplizService.logout();
          }
          this.loaderService.display(false);
        }
      );
    } else {
      this.amplizService.logout();
    }
  }

  exportCsv() {
    this.amplizService.downloadCsv().subscribe((response) => {
      const filename = response.headers.get("filename");
      //
      const name = "ampliz_fav_" + new Date().toISOString() + ".csv";
      this.saveFile(response.body, name);
    });
  }
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: "text/csv; charset=utf-8" });
    fileSaver.saveAs(blob, filename);
  }
  // downloadCSV() {
  //   const body = this.contactDetails;
  //   body.unshift({'name': 'Name', 'mobile': "Mobile", 'DirectDial': 'DirectDial', 'EmailAddress': 'EmailAddress', 'FullName': 'FullName', 'LinkedinURL': 'LinkedinURL', 'MarkedOn': 'Marked On', 'Title': 'Title', });
  //   // this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
  //   const name = 'ampliz_fav_' + new Date().toISOString();
  //   new  AngularCsv(this.contactDetails, name, body);
  //   body.shift();
  // }
}
