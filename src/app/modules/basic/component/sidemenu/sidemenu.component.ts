import { Component, OnInit, Input, NgZone } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.css"],
})
export class SidemenuComponent implements OnInit {
  @Input() elementName = "dashboard";
  public isSpecialityUser;
  constructor(private router: Router, private ngZone: NgZone) {}
  get dataSet() {
    return localStorage.getItem("Dataset") as string;
  }

  ngOnInit() {
    this.isSpecialityUser =
      localStorage.getItem("is_SpecialityUser") == "true" ? true : false;
    // console.log("speciality", this.isSpecialityUser);
  }
  public openItem(item: any): void {
    // console.log(item, "item");
    this.elementName = item;
    this.ngZone.run(() => this.router.navigateByUrl(item)).then();
  }
  // openItem(item = 'dashboard') {
  //   this.elementName = item;
  //   if (item === 'freecredits') {
  //     this.router.navigate(['freecredits']);
  //   } else if(item === 'contacts') {
  //     this.router.navigate(['contacts']);
  //   }
  //   else if (item === 'editprofile') {
  //     // alert("i am here")
  //     this.router.navigate(['editprofile']);
  //   }else if (item === 'pricing') {
  //     // alert("i am here")
  //     this.router.navigate(['pricing']);
  //   }    else {
  //     this.router.navigate(['dashboard']);
  //   }
  // }
}
