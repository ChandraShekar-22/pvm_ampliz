import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-npi-filter-drop-down",
  templateUrl: "./npi-filter-drop-down.component.html",
  styleUrls: ["./npi-filter-drop-down.component.css"],
})
export class NpiFilterDropDownComponent implements OnInit {
  @Output() onFilterChange = new EventEmitter<any>();
  @Input() selected: string = "";
  showMore: boolean = false;
  @Input()
  options = [
    { name: "Show all", value: "all" },
    { name: "With emails", value: "withemail" },
    { name: "Without email", value: "withoutemail" },
    { name: "With phone", value: "withphone" },
    { name: "Without phone", value: "withoutphone" },
  ];
  showAllClick() {
    this.showMore = !this.showMore;
  }

  constructor(private eRef: ElementRef) {}
  agInit(params: ICellRendererParams) {}
  get selectedName() {
    let name = "";
    this.options.every((el) => {
      if (this.selected === el.value) {
        name = el.name;
        return false;
      }
      return true;
    });
    return name;
  }
  onSelect(option) {
    this.onFilterChange.emit(option);
    this.showMore = false;
  }

  ngOnInit() {}
  @HostListener("document:click", ["$event"])
  clickout(event: { target: any }) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.showMore = false;
    }
  }
}
