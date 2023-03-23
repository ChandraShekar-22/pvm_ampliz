import { Component, Input, OnInit } from "@angular/core";
import { AmplizService } from "../../../healthcare/services/ampliz.service";
import { MessageService } from "src/app/modules/B2B/services/message.service";
@Component({
  selector: "app-request-contact",
  templateUrl: "./request-contact.component.html",
  styleUrls: ["./request-contact.component.css"],
})
export class RequestContactComponent implements OnInit {
  @Input() platform: string = "";
  @Input() id: any = "";

  constructor(
    private amplizService: AmplizService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  request(request: any) {
    const body = {
      comid: "0",
      url: window.location.href + `/${this.id}`,
      intentrequest: request,
    };
    this.amplizService.request_access(body).subscribe((res) => {
      this.messageService.display(true, res.msgInfo.msg);
    });
  }
}
