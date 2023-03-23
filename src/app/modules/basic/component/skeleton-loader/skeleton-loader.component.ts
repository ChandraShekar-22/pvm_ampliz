import { Component, Input, OnInit,  } from '@angular/core';
@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() loopCount: number = 10;
  Arr = Array; //Array type captured in a variable
  
  ngOnInit() {
    
  }

  numSequence(number: number): Array<number> {
    return this.Arr(number).fill(1)
  }

}
