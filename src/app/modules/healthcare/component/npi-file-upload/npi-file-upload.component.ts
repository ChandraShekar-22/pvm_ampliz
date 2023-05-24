import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "src/app/modules/B2B/services/message.service";
import { AmplizService } from "src/app/modules/healthcare/services/ampliz.service";

@Component({
  selector: "app-npi-file-upload",
  templateUrl: "./npi-file-upload.component.html",
  styleUrls: ["./npi-file-upload.component.css"],
})
export class NpiFileUploadComponent implements OnInit {
  showUploadProgress: boolean = false;
  fileName: string = "";
  size = "";
  fileProgress = 40;
  constructor(
    public amplizService: AmplizService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {}
  onFileUpload(event) {
    const file: File = event.target.files[0];
    if (file && file.type === "text/csv") {
      const formData = new FormData();
      let totalBytes = file.size;
      this.showUploadProgress = true;
      this.fileName = file.name;
      if (totalBytes < 1000000) {
        this.size = Math.floor(totalBytes / 1000) + " KB";
      } else {
        this.size = Math.floor(totalBytes / 1000000) + " MB";
      }

      formData.append("file", file);
      this.amplizService.uploadNpiFile(formData).subscribe((res) => {
        if (res.bulkNpiId) {
          this.fileProgress = 98;
          setTimeout(() => {
            this.router.navigate([`/npi-data-card/${res.bulkNpiId}`]);
          }, 2000);
        } else {
          this.showUploadProgress = false;
          this.messageService.displayError(
            true,
            res.errorMessage || "Unable to process the file please upload again"
          );
        }
      });
    } else {
      this.messageService.displayError(true, "Please upload csv file");
    }
  }
}
