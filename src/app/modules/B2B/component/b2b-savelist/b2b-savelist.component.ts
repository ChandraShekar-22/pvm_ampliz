import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  NgZone,
} from "@angular/core";
// import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Router } from "@angular/router";
@Component({
  selector: "app-b2b-savelist",
  templateUrl: "./b2b-savelist.component.html",
  styleUrls: ["./b2b-savelist.component.css"],
})
export class B2bSavelistComponent implements OnInit {
  @Input() b2bSaveDrawer: boolean = false;
  @Output()
  cancelBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() // private fb: FormBuilder,
  // public amplizService: AmplizService,
  // private loaderService: LoaderService,
  // private errorService: ErrorService,
  // private ngZone: NgZone,
  // public router: Router
  {}

  ngOnInit() {}
  closeDiv() {
    this.b2bSaveDrawer = false;
    this.cancelBtnClick.emit(false);
  }
}
