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
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { Imaging } from "src/app/modules/ImagingCenter/models/ImagingModel";
import { SearchImagingExecutivesModel } from "src/app/modules/ImagingCenter/models/SearchImagingExecutivesModel";
import { SearchImagingModel } from "src/app/modules/ImagingCenter/models/SearchImagingModel";
import { ImagingDataService } from "src/app/modules/ImagingCenter/services/imaging-data.service";
import { ImagingService } from "src/app/modules/ImagingCenter/services/imaging.service";
import { SearchPayorExecutive } from "../../models/search-payor-executive.model";
import { DataService } from "../../service/data.service";

@Component({
  selector: "app-payor-center-card",
  templateUrl: "./payor-center-card.component.html",
  styleUrls: ["./payor-center-card.component.css"],
})
export class PayorCenterCardComponent implements OnInit {
  @Input() imagingInfo: any;
  b2bSaveDrawer: boolean = false;
  showMore: boolean = true;
  sliceLength: number = 5;
  industryAndSkillset: Array<string> = [];
  notCorrectReasons: Array<string> = [
    "Center name",
    "Imaging equipments",
    "Location",
  ];
  smallResolution: boolean = false;
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private imagingService: ImagingService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (window.innerWidth < 1100) {
      this.smallResolution = true;
    } else {
      this.smallResolution = false;
    }
  }

  openUrl(type) {
    const url = this.imagingInfo[type];
    if (url !== "") {
      window.open("https://" + url, "popUpWindow");
    }
  }

  doSearchImaging(key: string, skill: any) {
    const imagingObj: SearchPayorExecutive = new SearchPayorExecutive();
    imagingObj[key] = [skill];
    this.dataService.passSearchPayourInput(imagingObj);
    this.dataService.changeSelectedTab(0);
  }
  onImagingNameClicked(iv) {
    if (iv.mcoCompanyId !== null && iv.mcoCompanyId !== undefined) {
      this.loaderService.display(true);
      const body = {
        icId: iv.mcoCompanyId,
      };
      this.imagingService.viewImagingCenterFromList(body).subscribe(
        (res) => {
          this.loaderService.display(false);
          this.router.navigate([]).then((result) => {
            window.open(`payor-company/${iv.mcoCompanyId}`, "_blank");
          });
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
    }
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
