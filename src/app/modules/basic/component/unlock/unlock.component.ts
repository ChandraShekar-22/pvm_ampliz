import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs-compat';
import { AmplizService } from '../../../healthcare/services/ampliz.service';
import { DataService } from '../../../healthcare/services/data.service';
import {MatDialog} from '@angular/material/dialog';
import { MessageService } from '../../../B2B/services/message.service';


@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.css']
})
export class UnlockComponent implements OnInit {
  selectedSearchData: any = {};
  filteredKeys: Array<any> = [];
  isSpecialityUser: boolean = false;
  constructor(
    private amplizService: AmplizService,
    private healthCareDataService: DataService,
    public router: Router,
    public dialog: MatDialog,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    this.getSearchData();
    setTimeout(() => {
      this.isSpecialityUser =
        localStorage.getItem("is_SpecialityUser") == "true" ? true : false;
      // console.log(this.isSpecialityUser, "this.isSpecialityUser");
    }, 10);
  }

  getSearchData() {
    const subscriber: Subscription =  this.healthCareDataService.physicianSearch.subscribe((data: any) => {
      this.selectedSearchData = data;
      // We are getting the keys of selectedSearchData
      const selectedSearchDataKeys=Object.keys(this.selectedSearchData);
      
      // We are checking whether any data has changed or not
      this.filteredKeys= selectedSearchDataKeys .filter(item => (this.selectedSearchData[item]==true||this.selectedSearchData[item].length>0))
      // console.log(this.filteredKeys,"filteredData");
    });
  }
  

  openModal(templateRef) {
    const subscriber: Subscription =  this.healthCareDataService.physicianSearch.subscribe((data: any) => {
    this.selectedSearchData = data;
    let dialogRef = this.dialog.open(templateRef, {
         width: '450px',
         // data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        // this.animal = result;
    });
  });
  subscriber.unsubscribe();
}

  public requestSearch() {
      // if (
      //   data.physicianSearchParams.specialityIncluded &&
      //   data.physicianSearchParams.specialityIncluded.length > 0
      // ) {

        if(this.router.url=='/executive') {
          this.amplizService.requestSpecialitySearchEx({executiveSearchParams:this.selectedSearchData}).subscribe((res: any) => {
            this.messageService.display(true, res.msgInfo.msg);
            // console.log(res);
          });
        } else {
          this.amplizService.requestSpecialitySearch({physicianSearchParams:this.selectedSearchData}).subscribe((res: any) => {
            this.messageService.display(true, res.msgInfo.msg);
            // console.log(res);
          });
        }
      
      // }
  }

}

