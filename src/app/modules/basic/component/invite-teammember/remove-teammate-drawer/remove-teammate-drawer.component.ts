import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AmplizService } from 'src/app/modules/healthcare/services/ampliz.service';
import { LoaderService } from 'src/app/modules/healthcare/services/loader.service';
import { ActiveUser } from '../../../models/invite-teammember-models';

@Component({
  selector: 'app-remove-teammate-drawer',
  templateUrl: './remove-teammate-drawer.component.html',
  styleUrls: ['./remove-teammate-drawer.component.css']
})
export class RemoveTeammateDrawerComponent implements OnInit {
  @Output() closeRemoveDrawer: EventEmitter<any> = new EventEmitter();
  @Output() removeUserSuccess: EventEmitter<any> = new EventEmitter();
  @Input() user: ActiveUser = new ActiveUser();
  constructor(private amplizService: AmplizService, private loaderService: LoaderService) { }

  ngOnInit() {

  }

  // remove teammate handler
  handlerRemoveTeammateDrawer(){
    this.closeRemoveDrawer.emit();
  }

  removeTeamMate() {
    const body = {
      userIdToBeRemoved: this.user.userId
    }
    this.loaderService.display(true);
    this.amplizService.removeTeamMember(body).subscribe(res=> {
      this.loaderService.display(false);
      this.removeUserSuccess.emit();
    }, err => {
      this.loaderService.display(false);
    })
  }


}
