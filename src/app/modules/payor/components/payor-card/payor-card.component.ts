import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { SearchImagingExecutivesModel } from "src/app/modules/ImagingCenter/models/SearchImagingExecutivesModel";
import { SearchImagingModel } from "src/app/modules/ImagingCenter/models/SearchImagingModel";
import { ImagingDataService } from "src/app/modules/ImagingCenter/services/imaging-data.service";
import { ImagingService } from "src/app/modules/ImagingCenter/services/imaging.service";
import { SearchPayorExecutive } from "../../models/search-payor-executive.model";
import { DataService } from "../../service/data.service";
import { PayorService } from "../../service/payor.service";

@Component({
  selector: "app-payor-card",
  templateUrl: "./payor-card.component.html",
  styleUrls: ["./payor-card.component.css"],
})
export class PayorCardComponent implements OnInit {
  @Input() imagingInfo: any;
  b2bSaveDrawer: boolean = false;
  showMore: boolean = true;
  sliceLength: number = 5;
  industryAndSkillset: Array<string> = [];
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private payorService: PayorService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private amplizService: AmplizService
  ) {}

  ngOnInit() {
    this.getIndustryAndSkillset();
    this.resetSliceLength();
  }

  get showSaveButton() {
    return this.imagingInfo.leadSaveStatus !== "Saved";
  }
  get isSaveButton() {
    return this.imagingInfo.leadSaveStatus == "Viewed";
  }
  get showRequest() {
    return (
      this.imagingInfo.email.length === 0 &&
      this.imagingInfo.phoneNumber.length === 0
    );
  }

  request(request: any) {
    this.loaderService.display(true);
    const body = {
      comid: "0",
      url: window.location.href,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.messageService.display(true, res.msg);
      },
      (err) => {
        this.loaderService.display(true);
      }
    );
  }

  resetSliceLength() {
    if (window.screen.availWidth < 1300) {
      this.sliceLength = 3;
    } else {
      this.sliceLength = 5;
    }
  }
  getIndustryAndSkillset() {
    const industryList = this.imagingInfo.industryList || [];
    const skillList = this.imagingInfo.skillList || [];
    this.industryAndSkillset = [...industryList, ...skillList];
  }
  invokeSaveList() {
    // console.log("save clicked")
    this.b2bSaveDrawer = true;
    // console.log(this.b2bSaveDrawer )
  }

  handleShowMore() {
    if (this.showMore == true) {
      this.sliceLength = this.imagingInfo.skillList.length;
    } else {
      this.resetSliceLength();
    }
    this.showMore = !this.showMore;
  }

  openUrl(type) {
    const url = this.imagingInfo[type];
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
  doSearchImaging(key: string, skill: any) {
    const imagingObj: SearchPayorExecutive = new SearchPayorExecutive();
    imagingObj[key] = [skill];
    this.dataService.passSearchPayourInput(imagingObj);
  }
  onImagingNameClicked(iv) {
    if (iv.mcoExecutiveId !== null && iv.mcoExecutiveId !== undefined) {
      if (this.imagingInfo.leadSaveStatus === "NotSaved") {
        this.viewContactAndOpen(iv.mcoExecutiveId);
      } else {
        // this.router.navigate([]).then((result) => {
        //   window.open(`payor/${iv.mcoExecutiveId}`, "_blank");
        // });
      }
    }
  }

  viewContactAndOpen(mcoExecutiveId: any) {
    const body = {
      mcoExecutiveId,
    };
    this.loaderService.display(true);
    this.payorService.viewPayourFromList(body).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.payorService
          .getPayourDetails(mcoExecutiveId)
          .subscribe((overview) => {
            this.dataService.addToSavedContacts([overview.mcoExecutiveInfo]);
            // this.router.navigate([]).then((result) => {
            //   window.open(`payor/${mcoExecutiveId}`, "_blank");
            // });
          });
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  get location() {
    let loc = [];
    if (this.imagingInfo.address != "" && this.imagingInfo.address) {
      loc.push(this.imagingInfo.address);
    }
    if (this.imagingInfo.city != "") {
      loc.push(this.imagingInfo.city);
    }
    if (this.imagingInfo.state != "") {
      loc.push(this.imagingInfo.state);
    }
    if (this.imagingInfo.country != "") {
      loc.push(this.imagingInfo.country);
    }
    return loc.join(", ");
  }
}
