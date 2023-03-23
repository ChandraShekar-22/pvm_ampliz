import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  HostListener,
} from "@angular/core";
import { Router } from "@angular/router";
import { AmplizService } from "../../../services/ampliz.service";
import { DataService } from "../../../services/data.service";
import { LoaderService } from "../../../services/loader.service";
import { MessageService } from 'src/app/modules/B2B/services/message.service';
@Component({
  selector: "app-physican-image",
  templateUrl: "./physican-image.component.html",
  styleUrls: ["./physican-image.component.css"],
})
export class PhysicanImageComponent implements OnInit, AfterViewInit {
  @Input() physicianData: any;
  @Input() currentCredit: any;
  @Input() dataIndex: any;
  @Input() checkboxDisabled: boolean = false;
  @Input() isPhysician: boolean = true;
  @Input() isPaid: boolean = false;
  @Output() DataRefreshed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkBoxChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() checkboxValue: boolean = true;
  isSpecialityUser: boolean;
  saveDrawer: boolean = false;
  notCorrectDrawer: boolean = false;
  showButtonLoader: boolean = false;
  smallResolution: boolean = false;
  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private amplizService: AmplizService,
    private dataService: DataService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) { }

  get showSaveButton() {
    return this.physicianData.leadSaveStatus !== 'Saved'
  }
  get saveButtonText() {
    return this.physicianData.leadSaveStatus == 'Viewed' ? 'Save' : 'View'
  }
  get showReqesutButton() {
    return (
     (this.physicianData.phoneNumber.length <= 0 && this.physicianData.email.length <= 0) || (this.physicianData.phoneNumber[0] === null &&this.physicianData.email[0] === null))
  }
  get isRequestEmail() {
    return (this.physicianData.email[0] == null || this.physicianData.email.length <= 0 || this.physicianData.email == '')
  }



  ngOnInit() {
    this.elementRef.nativeElement.style.setProperty(
      "--animation-order",
      this.dataIndex + 1
    );
    if(window.innerWidth < 1100) {
      this.smallResolution = true;
    } else {
      this.smallResolution = false;
    }
    
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.isSpecialityUser = localStorage.getItem("is_SpecialityUser") == "true" ? true : false;
    }, 10);
  }
  cancelBtnClick(value: boolean) {
    this.saveDrawer = value;
    this.notCorrectDrawer = value;
    // this.DataRefreshed.emit(true);
  }

  refreshedData(ev: boolean) {
    this.DataRefreshed.emit(ev);
  }

  onPhysicianNameClicked(ev) {
    if (ev.executiveId !== null && ev.executiveId !== undefined) {
      // this.router.navigate(['/executiveOverview',ev.executiveId]);
      this.router.navigate([]).then((result) => {
        window.open(`executiveOverview/${ev.executiveId}`, "_blank");
      });
    }
    if (ev.physicianId !== null && ev.physicianId !== undefined) {
      // this.router.navigate(['/physicianOverview',ev.physicianId]);
      this.router.navigate([]).then((result) => {
        window.open(`/physicianOverview/${ev.physicianId}`, "_blank");
      });
    }
  }

  goToHospital(id: any) {
    this.router.navigate([]).then((result) => {
      window.open(`/hospitalOverView/${id}`, "_blank");
    });
  }

  checkboxValueChange(event) {
    this.checkBoxChanged.emit(this.checkboxValue);
  }

  handleSaveButton() {
    if (this.physicianData.leadSaveStatus == 'NotSaved') {
      this.showButtonLoader = true;
      if (this.isPhysician == true) {
        this.viewPhysicianFromList();
      } else {
        this.viewExecutiveFromList();
      }
    } else {
      this.saveDrawer = true;
    }

  }

  viewPhysicianFromList() {
    // this.loaderService.display(true);
    this.amplizService
      .viewPhysicianFromList(this.physicianData.physicianId, null).subscribe(res => {
        this.amplizService.physicianOverviewDetails(this.physicianData.physicianId).subscribe(res => {
          this.showButtonLoader = false;

          this.dataService.addToSavedPhysician([res.physicianOverviewInfo.physicianInfoData]);
        },
          err => {
            this.showButtonLoader = false;
          });
      }, err => {
        this.showButtonLoader = false;
      });
  }
  viewExecutiveFromList() {
    this.amplizService
      .viewExecutiveFromList(this.physicianData.executiveId, null).subscribe(res => {
        this.amplizService.executiveOverviewDetails(this.physicianData.executiveId).subscribe(res => {
          this.showButtonLoader = false;
          this.dataService.addToSavedExecutive([
            res.healthExecutiveOverviewInfo.healthExecutiveInfoData,
          ]);
        },
          err => {
            this.showButtonLoader = false;
          });
      }, err => {
        this.showButtonLoader = false;
      });
  }
  request(request, id) {
    const body = {
      comid: "0",
      url: window.location.href + `/${id}`,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe((res) => {
      this.messageService.display(true, res.msg);
    });
  }
}
