export class PayorModel {
	constructor(
		public company: string = '',
		public payorExecutiveId: string = '',
		public phoneNumber: Array<any> = [],
		public email: Array<any> = [],
		public facebook: string = '',
		public fullName: string = '',
		public imageUrl: string = '',
		public inSavedList: boolean = false,
		public linkedinURL: string = '',
		public ltcTypeInclude: Array<any> = [],
		public location: string = '',
		public skillList: Array<any> = [],
		public title: Array<any> = [],
		public twitterURL: string = '',
		public state: string = '',
		public city: string = '',
		public country: string = ''
	) {}

	public toJson(): object {
		return {
			company: this.company,
			icExecutiveId: this.payorExecutiveId,
			directDialPhone: this.phoneNumber,
			email: this.email,
			facebook: this.facebook,
			fullName: this.fullName,
			imageUrl: this.imageUrl,
			inSavedList: this.inSavedList,
			linkedinURL: this.linkedinURL,
			industryList: this.ltcTypeInclude,
			location: this.location,
			skillList: this.skillList,
			title: this.title,
			twitterURL: this.twitterURL,
			state: this.state,
			city: this.city,
			country: this.country,
		}
	}
	public fromJson(obj: any): PayorModel {
		return new PayorModel(
			obj.company,
			obj.contactId,
			obj.directDialPhone,
			obj.email,
			obj.facebook,
			obj.fullName,
			obj.imageUrl,
			obj.inSavedList,
			obj.linkedinURL,
			obj.location,
			obj.skillList,
			obj.title,
			obj.twitterURL,
			obj.state,
			obj.city,
			obj.country
		)
	}
}

export class PayorList {
	constructor(public PayorInfoList: Array<PayorModel> = []) {}

	updateLTCListFromSavedList(savedList: Array<PayorModel>) {
		savedList.map((savedLTC: PayorModel) => {
			const index = this.PayorInfoList.findIndex(
				(ltcItem) => savedLTC.payorExecutiveId == ltcItem.payorExecutiveId
			)
			if (index !== -1) {
				this.PayorInfoList[index] = savedLTC
			}
		})
	}
}
