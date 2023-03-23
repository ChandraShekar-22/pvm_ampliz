import { Component, OnInit } from '@angular/core';
import { AmplizService } from '../../../../healthcare/services/ampliz.service';

declare var chrome;

@Component({
  selector: 'app-install-prospector',
  templateUrl: './install-prospector.component.html',
  styleUrls: ['./install-prospector.component.css']
})
export class InstallProspectorComponent implements OnInit {
  showChrmBtn: boolean;
  chromeData = {};
  constructor(private amplizService: AmplizService) { }

  ngOnInit() {
    let isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    let isIE = false;

    if (isChrome) {
      this.checkChromeExtenstion();

      isIE = true;
      //
    }
  }
  checkChromeExtenstion() {

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
}
