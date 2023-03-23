import { animate, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { LoaderService } from "src/app/modules/healthcare/services/loader.service";
import { B2bService } from "../../services/b2b.service";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-not-correct",
  templateUrl: "./not-correct.component.html",
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate("300ms", style({ transform: "translateX(0)", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", opacity: 1 }),
        animate("300ms", style({ transform: "translateX(100%)", opacity: 0 })),
      ]),
    ]),
  ],
  styleUrls: ["./not-correct.component.css"],
})
export class NotCorrectComponent implements OnInit {
  showOtherTextField: boolean = false;
  notCorrectReasons: Array<any> = [
    "Company",
    "Title",
    "Department",
    "Seniority",
    "Skill",
    "Location",
  ];
  selectedReason: string = "";
  @Input() contactId: any = "";
  @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;
  constructor(
    private b2bService: B2bService,
    private loaderServe: LoaderService,
    private messageService: MessageService
  ) {}
  ngOnInit() {}

  otherClicked(event) {
    event.stopPropagation();
    this.showOtherTextField = true;
    this.selectedReason = "";
  }
  matMenuOpened() {
    this.showOtherTextField = false;
  }
  selectReason(reason: any) {
    if (reason !== "") {
      this.menuTrigger.closeMenu();
      this.loaderServe.display(true);
      this.selectedReason = reason;
      const body = {
        forData: reason,
        contactId: this.contactId,
      };
      this.b2bService.reportDataNotCorrect(body).subscribe(
        (res) => {
          this.loaderServe.display(false);
          this.messageService.display(
            true,
            "We Got your feedback, will get back to you soon on this"
          );
        },
        (err) => {
          this.loaderServe.display(false);
          this.messageService.displayError(true, "Error");
        }
      );
    }
  }
}
