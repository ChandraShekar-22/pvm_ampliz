import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { SearchLTCModel } from "../../../models/SearchLTCModel";
import { LTCDataService } from "../../../services/ltc-data.service";
@Component({
  selector: "app-ltc-card",
  templateUrl: "./ltc-card.component.html",
  styleUrls: ["./ltc-card.component.css"],
})
export class LtcCardComponent implements OnInit {
  @Input() ltcInfo: any;
  b2bSaveDrawer: boolean = false;
  showMore: boolean = true;
  sliceLength: number = 5;
  industryAndSkillset: Array<string> = [];
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;

  constructor(private dataService: LTCDataService, private router: Router) {}

  ngOnInit() {
    this.getIndustryAndSkillset();
    this.resetSliceLength();
  }

  get showSaveButton() {
    return this.ltcInfo.leadSaveStatus !== "Saved";
  }
  get isSaveButton() {
    return this.ltcInfo.leadSaveStatus == "Viewed";
  }

  resetSliceLength() {
    if (window.screen.availWidth < 1300) {
      this.sliceLength = 3;
    } else {
      this.sliceLength = 5;
    }
  }
  getIndustryAndSkillset() {
    const industryList = this.ltcInfo.industryList || [];
    const skillList = this.ltcInfo.skillList || [];
    this.industryAndSkillset = [...industryList, ...skillList];
  }
  invokeSaveList() {
    // console.log("save clicked")
    this.b2bSaveDrawer = true;
    // console.log(this.b2bSaveDrawer )
  }

  handleShowMore() {
    if (this.showMore == true) {
      this.sliceLength = this.ltcInfo.skillList.length;
    } else {
      this.resetSliceLength();
    }
    this.showMore = !this.showMore;
  }

  openUrl(type) {
    const url = this.ltcInfo[type];
    if (url !== "") {
      window.open("https://" + url, "popUpWindow");
    }
  }

  cancelBtnClick(value: boolean) {
    this.b2bSaveDrawer = value;
  }

  handleCheckboxChange(event) {
    this.checkboxChange.emit(this.checkboxSelected);
  }
  doSearchLTC(key: string, skill: any) {
    const ltcObj: SearchLTCModel = new SearchLTCModel();
    ltcObj[key] = [skill];
    this.dataService.passSearchLTCInput(ltcObj);
  }
  onLtcNameClicked(ltc) {
    if (ltc.ltcExecutiveId !== null && ltc.ltcExecutiveId !== undefined) {
      this.router.navigate([]).then((result) => {
        window.open(`ltc/${ltc.ltcExecutiveId}`, "_blank");
      });
    }
  }
  get location() {
    let loc = "";
    if (this.ltcInfo.city != "") {
      loc = this.ltcInfo.city;
    }
    if (this.ltcInfo.state != "" && this.ltcInfo.city != "") {
      loc = `${loc}, ${this.ltcInfo.state}`;
    } else if (this.ltcInfo.state != "" && this.ltcInfo.city == "") {
      loc = `${this.ltcInfo.state}`;
    }
    // if (
    //   this.ltcInfo.country != "" &&
    //   this.ltcInfo.state == "" &&
    //   this.ltcInfo.city == ""
    // ) {
    //   loc = `${this.ltcInfo.country}`;
    // } else {
    //   loc = `${loc}, ${this.ltcInfo.state}`;
    // }
    return loc;
  }
}
