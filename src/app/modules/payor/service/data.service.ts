import { Injectable } from '@angular/core'
import { SearchPayourModel } from '../models/search-payor-model.model'
import { PayorModel } from '../models/payor-model.model'
import { BehaviorSubject } from 'rxjs/Rx'
import { PayorExecutive } from '../models/payor-executive.model'
import { SearchPayorExecutive } from '../models/search-payor-executive.model'

@Injectable({
	providedIn: 'root',
})
export class DataService {
	public ltcSearchData = new BehaviorSubject({
		data: new SearchPayourModel(),
		fromSearch: false,
	})
	public payourSearchData = new BehaviorSubject({
		data: new SearchPayorExecutive(),
		fromSearch: false,
	})
	public savedPayor: BehaviorSubject<Array<PayorExecutive>> = new BehaviorSubject([])
	private apacList = new BehaviorSubject([])
	public mainSelectedTab = new BehaviorSubject(0)

	private firstTimeLoad = new BehaviorSubject(true)

	firstLoad = this.firstTimeLoad.asObservable()
	apacListSubscriber = this.apacList.asObservable()

	constructor() {}

	passSearchLTCInput(contact: SearchPayourModel, fromSearch: boolean = true) {
		this.ltcSearchData.next({ data: contact, fromSearch: fromSearch })
	}
	passSearchPayourInput(contact: SearchPayorExecutive, fromSearch: boolean = true) {
		this.payourSearchData.next({ data: contact, fromSearch: fromSearch })
	}

	addToSavedLTC(value: Array<PayorExecutive>) {
		this.savedPayor.next(value)
	}
	changeApacList(apac: any) {
		this.apacList.next(apac)
	}
	addToSavedContacts(value: Array<PayorExecutive>) {
		this.savedPayor.next(value)
	}
	changeSelectedTab(tab: number) {
		this.mainSelectedTab.next(tab)
	}
}
