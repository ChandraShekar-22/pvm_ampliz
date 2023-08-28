export class SearchContactInput {
	constructor(
		public offset: number = 0,
		public count: number = 25,
		public companyList: Array<any> = [],
		// public fullName: string = "",
		public fullNameList: Array<any> = [],
		public titleInclude: Array<any> = [],
		public titleExclude: Array<any> = [],
		public industryInclude: Array<any> = [],
		public industryExclude: Array<any> = [],
		public deptInclude: Array<any> = [],
		public deptExclude: Array<any> = [],
		public skillInclude: Array<any> = [],
		public skillExclude: Array<any> = [],
		public seniority: Array<any> = [],
		public countryList: Array<any> = [],
		public stateList: Array<any> = [],
		public cityList: Array<any> = [],
		public revenue: Array<any> = [],
		public specialtyIds: Array<any> = [],
		// public employeeRange: Array<any> = [],
		public employeeRangeList: Array<any> = [],
		public searchType: string = 'TOTAL',
		public savedListOffset: number = 0,
		public clientIp: string = ''
	) {}

	public toJson(): object {
		return {
			offset: this.offset,
			count: this.count,
			companyList: this.companyList,
			// fullName: this.fullName,
			titleInclude: this.titleInclude,
			titleExclude: this.titleExclude,
			industryInclude: this.industryInclude,
			industryExclude: this.industryExclude,
			deptInclude: this.deptInclude,
			deptExclude: this.deptExclude,
			skillInclude: this.skillInclude,
			skillExclude: this.skillExclude,
			seniority: this.seniority,
			countryList: this.countryList,
			stateList: this.stateList,
			cityList: this.cityList,
			revenue: this.revenue,
			specialtyIds: this.specialtyIds,
			// employeeRange: this.employeeRange,
			employeeRangeList: this.employeeRangeList,
			searchType: this.searchType,
			fullNameList: this.fullNameList,
			savedListOffset: this.savedListOffset,
			clientIp: this.clientIp
		};
	}

	public fromJson(obj: any): SearchContactInput {
		return new SearchContactInput(
			obj.offset,
			obj.count,
			obj.companyList,
			// obj.fullName,
			obj.fullNameList,
			obj.titleInclude,
			obj.titleExclude,
			obj.industryInclude,
			obj.industryExclude,
			obj.deptInclude,
			obj.deptExclude,
			obj.skillInclude,
			obj.skillExclude,
			obj.seniority,
			obj.countryList,
			obj.stateList,
			obj.cityList,
			obj.revenue,
			obj.specialtyIds,
			// obj.employeeRange,
			obj.employeeRangeList,
			obj.searchType,
			obj.savedListOffset
		);
		// return {
		//   offset: this.offset,
		//   count: this.count,
		//   companyList: this.companyList,
		//   fullName: this.fullName,
		//   titleInclude: this.titleInclude,
		//   titleExclude: this.titleExclude,
		//   industryInclude: this.industryInclude,
		//   industryExclude: this.industryExclude,
		//   deptInclude: this.deptInclude,
		//   deptExclude: this.deptExclude,
		//   skillInclude: this.skillInclude,
		//   skillExclude: this.skillExclude,
		//   seniority: this.seniority,
		//   countryList: this.countryList,
		//   stateList: this.stateList,
		//   cityList: this.cityList,
		//   revenue: this.revenue,
		// employeeRange: this.employeeRange,
		//   searchType: this.searchType
		// }
	}

	validateContactSearch() {
		return (
			this.companyList.length > 0 ||
			// this.fullName.length > 0 ||
			this.titleInclude.length > 0 ||
			this.titleExclude.length > 0 ||
			this.industryInclude.length > 0 ||
			this.industryExclude.length > 0 ||
			this.deptInclude.length > 0 ||
			this.deptExclude.length > 0 ||
			this.skillInclude.length > 0 ||
			this.skillExclude.length > 0 ||
			this.seniority.length > 0 ||
			this.countryList.length > 0 ||
			this.stateList.length > 0 ||
			this.cityList.length > 0 ||
			this.revenue.length > 0 ||
			this.employeeRangeList.length > 0 ||
			// this.employeeRange.length > 0 ||
			this.specialtyIds.length > 0
		);
	}

	getChangedItems() {
		let changedItems = [];
		SearchContactInput.titleKeyArray.map((item) => {
			if (this[item.key].length > 0) {
				item['value'] = this[item.key];
				changedItems.push(item);
			}
		});
		return changedItems;
	}

	static titleKeyArray = [
		{ key: 'companyList', title: 'Company List', type: 'array' },
		{ key: 'fullNameList', title: 'Full Name', type: 'array' },
		{ key: 'titleInclude', title: 'Title Include', type: 'array' },
		{ key: 'titleExclude', title: 'Title Exclude', type: 'array' },
		{ key: 'industryInclude', title: 'Industry Include', type: 'array' },
		{ key: 'industryExclude', title: 'Industry Exclude', type: 'array' },
		{ key: 'deptInclude', title: 'Department Include', type: 'array' },
		{ key: 'deptExclude', title: 'Department Exclude', type: 'array' },
		{ key: 'skillInclude', title: 'Skill Include', type: 'array' },
		{ key: 'skillExclude', title: 'Skill Exclude', type: 'array' },
		{ key: 'seniority', title: 'Seniority', type: 'array' },
		{ key: 'countryList', title: 'Country List', type: 'array' },
		{ key: 'stateList', title: 'State List', type: 'array' },
		{ key: 'cityList', title: 'City List', type: 'array' },
		{ key: 'revenue', title: 'Revenue', type: 'array' },
		// { key: 'employeeRange', title: 'Employee Range', type: 'array' },
		{ key: 'employeeRangeList', title: 'Employee Range', type: 'array' },
		{ key: 'specialtyIds', title: 'Company Keyword', type: 'array' }
	];
}