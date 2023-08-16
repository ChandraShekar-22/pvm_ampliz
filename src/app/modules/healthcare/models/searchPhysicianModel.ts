export class SearchPhysicianModel {
	constructor(
		public specialityIncluded: Array<string> = [],
		public specialityExcluded: Array<string> = [],
		public physicianName: string = '',
		public npiNumber: Array<string> = [],
		public hospitalNameList: Array<string> = [],
		public cityList: Array<string> = [],
		public stateList: Array<string> = [],
		public offset: number = 0,
		public savedListOffset: number = 5,
		public limit: number = 5,
		public emailTypeIsp: string = '',
		public provider_Type: string = '',
		public leadWithEmail: boolean = false,
		public leadWithPhone: boolean = false,
		public searchType: string = '',
		public clientIp: string = '',
		public email_Score: any = [],
		public experience: string[] = [],
		public languages: string[] = [],
		public age: string = ''
	) {}

	public toJson(): object {
		return {
			specialityIncluded: this.specialityIncluded,
			specialityExcluded: this.specialityExcluded,
			physicianName: this.physicianName,
			npiNumber: this.npiNumber,
			hospitalNameList: this.hospitalNameList,
			cityList: this.cityList,
			stateList: this.stateList,
			offset: this.offset,
			savedListOffset: this.savedListOffset,
			limit: this.limit,
			emailTypeIsp: this.emailTypeIsp,
			provider_Type: this.provider_Type,
			leadWithEmail: this.leadWithEmail,
			leadWithPhone: this.leadWithPhone,
			searchType: this.searchType,
			clientIp: this.clientIp,
			email_Score: this.email_Score,
			experience: this.experience,
			languages: this.languages,
			age: this.age
		};
	}

	public fromJson(obj: any): SearchPhysicianModel {
		return new SearchPhysicianModel(
			obj.specialityIncluded,
			obj.specialityExcluded,
			obj.physicianName,
			obj.npiNumber,
			obj.hospitalNameList,
			obj.cityList,
			obj.stateList,
			obj.offset,
			obj.savedListOffset,
			obj.limit,
			obj.emailTypeIsp,
			obj.provider_Type,
			obj.leadWithEmail,
			obj.leadWithPhone,
			obj.searchType,
			obj.clientIp,
			obj.email_Score,
			obj.experience,
			obj.languages,
			obj.age
		);
	}
}
