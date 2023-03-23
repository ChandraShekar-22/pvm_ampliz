import { N } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/modules/B2B/services/message.service';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';

@Component({
  selector: "app-verify-user",
  templateUrl: "./verify-user.component.html",
  styleUrls: ["./verify-user.component.css"],
})
export class VerifyUserComponent implements OnInit {
  public otp: string = "";
  public email: string = "";
  public currentEmailId: string = "";

  constructor(
    private amplizService: AmplizService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem("signedUpEmail");
    this.currentEmailId = localStorage.getItem("signedUpEmail");
  }

  async verifyInviteSignup() {
    // console.log("line21", this.otp);
    const body = {
      email: this.email,
      verification_code: this.otp,
    };

    this.amplizService.verifyEmailSignup(body).subscribe((res) => {
      this.messageService.display(true, "verification successful");
      this.router.navigate(["/login"]);
      localStorage.removeItem("signedUpEmail");
    });
  }

  async resendVerificationcode() {
    const body = {
      email: this.currentEmailId,
    };
    this.amplizService.regenerateVerificationCode(body).subscribe((res) => {
      this.messageService.display(
        true,
        "Verification code has been regenerated successfully"
      );
    });
  }

  backToSignUp() {
    this.router.navigate(["/signup"]);
  }
}
