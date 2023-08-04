export class SearchPayourModel {
	constructor(
		public centerName: Array<any> = [],
		public cityList: Array<any> = [],
		public stateList: Array<any> = [],
		public offset: number = 0,
		public limit: number = 5,
		public industry: string | string[] = []
	) {}

	public toJson(): object {
		return {
			centerName: this.centerName,
			cityList: this.cityList,
			stateList: this.stateList,
			offset: this.offset,
			limit: this.limit,
			industry: this.industry,
		}
	}

	public fromJson(obj: any): SearchPayourModel {
		return new SearchPayourModel(
			obj.centerName,
			obj.cityList,
			obj.stateList,
			obj.offset,
			obj.limit,
			obj.industry
		)
	}

	validateImagingSearch() {
		return (
			this.centerName.length > 0 ||
			this.cityList.length > 0 ||
			this.stateList.length > 0 ||
			this.industry.length > 0
		)
	}

	getChangedItems() {
		let changedItems = []
		SearchPayourModel.titleKeyArray.map((item) => {
			if (this[item.key].length > 0) {
				item['value'] = this[item.key]
				changedItems.push(item)
			}
		})
		return changedItems
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
		{ key: 'revenue', title: 'Revenue', type: 'text' },
		{ key: 'employeeRangeList', title: 'Employee Range', type: 'array' },
	]
}
