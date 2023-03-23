import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { B2bService } from 'src/app/modules/B2B/services/b2b.service';
import { DataService } from 'src/app/modules/B2B/services/data.service';
import { AmplizService } from '../../../../healthcare/services/ampliz.service';
declare var chrome;

@Component({
  selector: "app-activity-card",
  templateUrl: "./activity-card.component.html",
  styleUrls: ["./activity-card.component.css"],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate("300ms", style({ transform: "translateX(0)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class ActivityCardComponent implements OnInit {
  activitylist: Array<any> = [
    {
      icon: "users",
      type: "invite",
      heading: "Invite your team member to Ampliz",
      subHeading: "your friends to ampliz, and get 15% bonus search limit",
      searchCount: 15,
      creditCount: 5,
      searchText: "searches",
      creditText: "credits",
      action: "startActivity",
      isActive: true,
    },
    {
      icon: "phone-call",
      type: "add_phone",
      heading: "Add your phone number",
      subHeading: "Add your phone number, and get 20% bonus search limit",
      searchCount: 20,
      creditCount: 5,
      searchText: "searches",
      creditText: "credits",
      action: "startActivity",
      isActive: false,
    },
    {
      icon: "Chrome",
      type: "install",
      heading: "Install LinkedIn prospector",
      subHeading:
        "Download  salesbuddy extension, and get 15% bonus search limit",
      searchCount: 15,
      creditCount: 5,
      searchText: "searches",
      creditText: "credits",
      action: "startActivity",
      isActive: true,
    },
  ];
  currentActiveComponent: string = "add_phone";
  activeComponentArray: Array<any> = ["main"];
  showChrmBtn: boolean;
  chromeData = {};
  @Input() showBackButton = false;
  @Output() closeClick: EventEmitter<any> = new EventEmitter();
  constructor(
    private amplizService: AmplizService,
    private b2bService: B2bService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getActivityStatus();
    let isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    let isIE = false;
    if (isChrome) {
      this.checkChromeExtenstion();

      isIE = true;
      //
    }
  }

  getActivityStatus() {
    this.b2bService.getActivityStatus().subscribe(
      (res: any) => {
        this.activitylist[1].isActive = res.isPhoneNumberAdded || false;
        this.activitylist[0].isActive = res.isEmailIdsAdded || false;
      },
      (err) => {}
    );
  }
  startActivity(type) {
    this.activeComponentArray.push(type);
  }
  goBack() {
    this.activeComponentArray.pop();
  }
  checkChromeExtenstion() {
    // alert('reaching here')
    if (chrome.runtime) {
      chrome.runtime.sendMessage(
        "abgoaphadkcmbkapnamhkcgkaddlmfal",
        { message: "isinstalled" },
        (response) => {
          //
          if (chrome.runtime.lastError) {
            //
            this.showChrmBtn = true;
            //
            this.chromeData = {
              chrome_status: "Not Installed",
            };
          } else {
            this.showChrmBtn = false;
            this.chromeData = {
              chrome_status: "Installed",
            };
          }
          // console.log("chrome data", this.chromeData);
          this.amplizService.chromeStatus(this.chromeData).subscribe(
            (res) => {
              //
            },
            (error) => {
              //
            }
          );
        }
      );
    }
  }
  getSearchQuota() {
    this.b2bService.getSearchQuota().subscribe(
      (res) => {
        this.dataService.passSearchQuota(res.percentageUsed);
        // this.searchQuota = 10;
        // this.dataService.passSearchQuota(100);
      },
      (err) => {
        this.dataService.passSearchQuota(100);
      }
    );
  }
  mainBack() {
    this.closeClick.emit();
  }
}
