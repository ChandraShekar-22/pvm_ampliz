import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-add-team-member',
	templateUrl: './add-team-member.component.html',
	styleUrls: ['./add-team-member.component.css'],
})
export class AddTeamMemberComponent implements OnInit {
	@Output() cancelAddMember: EventEmitter<boolean> = new EventEmitter();
	constructor() {}

	ngOnInit(): void {}

	handleCancel() {
		this.cancelAddMember.emit(true);
	}
}
