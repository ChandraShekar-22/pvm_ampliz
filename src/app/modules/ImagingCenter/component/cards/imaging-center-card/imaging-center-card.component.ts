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
import { Imaging } from "../../../models/ImagingModel";
import { SearchImagingExecutivesModel } from "../../../models/SearchImagingExecutivesModel";
import { SearchImagingModel } from "../../../models/SearchImagingModel";
import { ImagingDataService } from "../../../services/imaging-data.service";
import { ImagingService } from "../../../services/imaging.service";
@Component({
  selector: "app-imaging-center-card",
  templateUrl: "./imaging-center-card.component.html",
  styleUrls: [
    "./imaging-center-card.component.css",
    "../imaging-card/imaging-card.component.css",
  ],
})
export class ImagingCenterCardComponent implements OnInit {
  @Input() imagingInfo: Imaging;
  b2bSaveDrawer: boolean = false;
  showMore: boolean = true;
  sliceLength: number = 5;
  industryAndSkillset: Array<string> = [];
  notCorrectReasons: Array<string> = ['Center name','Imaging equipments','Location'];
  smallResolution: boolean = false;
  @Input() checkboxSelected: boolean = false;
  @Input() isSubscribed: boolean = false;
  @Output() checkboxChange = new EventEmitter();
  @Input() checkboxDisabled: boolean = false;

  constructor(
    private dataService: ImagingDataService,
    private router: Router,
    private imagingService: ImagingService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if(window.innerWidth < 1100) {
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
    const imagingObj: SearchImagingExecutivesModel =
      new SearchImagingExecutivesModel();
    imagingObj[key] = [skill];
    this.dataService.passSearchImagingInput(imagingObj);
    this.dataService.changeSelectedTab(0);
  }
  onImagingNameClicked(iv) {
    if (iv.imagingCenterId !== null && iv.imagingCenterId !== undefined) {
      this.loaderService.display(true);
      const body ={
        icId: iv.imagingCenterId
      }
      this.imagingService.viewImagingCenterFromList(body).subscribe(res => {
        this.loaderService.display(false);
        this.router.navigate([]).then((result) => {
          window.open(`imagingOverview/${iv.imagingCenterId}`, "_blank");
        });
      },
      err => {
        this.loaderService.display(false);
      })

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
