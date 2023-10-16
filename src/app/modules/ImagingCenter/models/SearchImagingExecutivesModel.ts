export class SearchImagingExecutivesModel {
	constructor(
		public fullName: Array<any> = [],
		public titleInclude: Array<any> = [],
		public titleExclude: Array<any> = [],
		public company: Array<any> = [],
		public industryInclude: Array<any> = [],
		public industryExclude: Array<any> = [],
		public department: Array<any> = [],
		public seniority: Array<any> = [],
		public cityList: Array<any> = [],
		public stateList: Array<any> = [],
		public searchType: string = 'TOTAL',
		public offset: number = 0,
		public limit: number = 5,
		public savedListOffset: number = 0,
		public numberOfImagingEquipments: number = 0,
		public nameOfImagingEquipments: Array<any> = [],
		public imagingEquipments: Array<string> = []
	) {}

	public toJson(): object {
		return {
			fullName: this.fullName,
			titleInclude: this.titleInclude,
			titleExclude: this.titleExclude,
			company: this.company,
			industryInclude: this.industryInclude,
			industryExclude: this.industryExclude,
			department: this.department,
			seniority: this.seniority,
			cityList: this.cityList,
			stateList: this.stateList,
			searchType: this.searchType,
			offset: this.offset,
			limit: this.limit,
			savedListOffset: this.savedListOffset,
			numberOfImagingEquipments: this.numberOfImagingEquipments,
			nameOfImagingEquipments: this.nameOfImagingEquipments,
			imagingEquipments: this.imagingEquipments
		};
	}

	public fromJson(obj: any): SearchImagingExecutivesModel {
		return new SearchImagingExecutivesModel(
			obj.fullName,
			obj.titleInclude,
			obj.titleExclude,
			obj.company,
			obj.industryInclude,
			obj.industryExclude,
			obj.department,
			obj.seniority,
			obj.cityList,
			obj.stateList,
			obj.searchType,
			obj.offset,
			obj.limit,
			obj.savedListOffset,
			obj.numberOfImagingEquipments,
			obj.nameOfImagingEquipments,
			obj.imagingEquipments
		);
	}

	validateImagingSearch() {
		return (
			this.fullName.length > 0 ||
			this.titleInclude.length > 0 ||
			this.titleExclude.length > 0 ||
			this.company.length > 0 ||
			this.industryInclude.length > 0 ||
			this.industryExclude.length > 0 ||
			this.department.length > 0 ||
			this.seniority.length > 0 ||
			this.cityList.length > 0 ||
			this.stateList.length > 0 ||
			this.numberOfImagingEquipments > 0 ||
			this.nameOfImagingEquipments.length > 0 ||
			this.imagingEquipments.length > 0
		);
	}

	getChangedItems() {
		let changedItems = [];
		SearchImagingExecutivesModel.titleKeyArray.map((item) => {
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
		{ key: 'revenue', title: 'Revenue', type: 'text' },
		{ key: 'employeeRangeList', title: 'Employee Range', type: 'array' }
	];
}
