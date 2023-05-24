import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-card',
  templateUrl: './feedback-card.component.html',
  styleUrls: ['./feedback-card.component.css'],
})
export class FeedbackCardComponent implements OnInit {
  @Input() username: string;
  constructor() {}

  ngOnInit(): void {}
}
