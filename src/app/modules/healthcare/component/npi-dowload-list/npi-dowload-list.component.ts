import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { AmplizService } from "../../services/ampliz.service";
import { Papa } from "ngx-papaparse";

@Component({
  selector: "app-npi-dowload-list",
  templateUrl: "./npi-dowload-list.component.html",
  styleUrls: ["./npi-dowload-list.component.css"],
})
export class NpiDowloadListComponent implements OnInit {
  @Input() saveListDiv: boolean = true;
  @Input() currentCredit: any;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  loading: boolean = false;
  refreshedData: EventEmitter<boolean> = new EventEmitter<boolean>();
  savedList: any = [
    { name: "Show all", value: "all" },
    { name: "With emails", value: "withemail" },
    { name: "Without email", value: "withoutemail" },
    { name: "With phone", value: "withphone" },
    { name: "Without phone", value: "withoutphone" },
  ];
  sideNav: boolean = false;
  selectListForm: FormGroup;
  formSubmitAttempt: boolean;
  bulkNpiId: string;
  updatedCredits: any = localStorage.getItem("credits");
  downloadNumber: any = {
    allcount: 0,
    withEmailCount: 0,
    withoutEmailCount: 0,
    withPhoneCount: 0,
    withoutPhone: 0,
  };

  constructor(
    private fb: FormBuilder,
    public amplizService: AmplizService,
    private ngZone: NgZone,
    public router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private papa: Papa
  ) {
    this.selectListForm = fb.group({
      filter: ["", [Validators.required]],
      fileName: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.bulkNpiId = res.bulkNpiId;
    });
    this.getDownloadNumbers();
    this.updateCreditScore();
  }
  public openItem(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  getDownloadNumbers() {
    this.amplizService.npiDownloadNumbers(this.bulkNpiId).subscribe((res) => {
      this.downloadNumber = res;
    });
  }
  cancelSaveDiv() {
    this.sideNav = true;
    this.saveListDiv = false;
    this.selectListForm.reset();
    this.formSubmitAttempt = false;
    setTimeout(() => {
      this.cancelBtnClick.emit(false);
    }, 1000);
    this.updateCreditScore();
  }

  updateCreditScore() {
    this.amplizService.getDashboardDetails().subscribe((res) => {
      localStorage.setItem("credits", res.CurrentCredits);
      this.updatedCredits = res.CurrentCredits;
    });
  }
  saveList() {
    this.formSubmitAttempt = true;
    if (this.selectListForm.valid) {
      this.loading = true;
      const filter = this.selectListForm.value.filter;
      const fileName = this.selectListForm.value.fileName;
      this.amplizService
        .downloadPhysicianData(this.bulkNpiId, filter, fileName)
        .subscribe(
          (res: string) => {
            const csvdata = "data:text/csv;charset=utf-8," + res;
            var encodedUri = encodeURI(csvdata);

            const anchor = document.createElement("a");
            anchor.href = encodedUri;
            anchor.download = `${fileName}`;
            anchor.click();
            anchor.remove();
            this.formSubmitAttempt = false;
            this.cancelSaveDiv();
            this.loading = false;
          },
          (error) => {
            console.error(error);
            this.loading = false;
          }
        );
    } else {
    }
  }
  parseCSV(data: string): void {
    this.papa.parse(data, {
      complete: (results) => {
        // `results` contains parsed CSV data
        console.log(results);
      },
      header: true, // Set this to `true` if your CSV file has headers
    });
  }
}
