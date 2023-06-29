import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DataServiceService {
	public memberInvited: BehaviorSubject<boolean> = new BehaviorSubject(false);
	public cancelAddMember: BehaviorSubject<boolean> = new BehaviorSubject(false);

	constructor() {}
}
