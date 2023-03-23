import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AmplizService } from "../../../healthcare/services/ampliz.service";

@Component({
  selector: "app-splashscreen",
  templateUrl: "./splashscreen.component.html",
  styleUrls: ["./splashscreen.component.css"],
})
export class SplashscreenComponent implements OnInit {
  constructor(private router: Router, private amplizService: AmplizService) {}

  ngOnInit() {
    // localStorage.removeItem('siteUrl');
    this.checkStorage();
    //
  }
  async checkStorage() {
    const authToken = await localStorage.getItem("auth_token");
    const refreshToken = await localStorage.getItem("refresh_token");
    const dataSet = await localStorage.getItem("Dataset");
    if (authToken === null || refreshToken === null) {
      await this.amplizService.logout();
      this.router.navigate(["login"]);
    } else {
      if (dataSet === "B2B") {
        this.router.navigate(["dashboard"]);
      } else {
        this.router.navigate(["hcdashboard"]);
      }
    }
  }
}
