export class SearchLTCModel {
  constructor(
    public fullNameList: Array<any> = [],
    public titleInclude: Array<any> = [],
    public titleExclude: Array<any> = [],
    public companyList: Array<any> = [],
    public ltcTypeInclude: Array<any> = [],
    public ltcTypeExclude: Array<any> = [],
    public department: Array<any> = [],
    public seniority: Array<any> = [],
    public cityList: Array<any> = [],
    public stateList: Array<any> = [],
    public searchType: string = 'TOTAL',
    public offset: number = 0,
    public limit: number = 5,
    public savedListOffset: number = 0
  ) { }

  public toJson(): object {
    return {
      fullNameList: this.fullNameList,
      titleInclude: this.titleInclude,
      titleExclude: this.titleExclude,
      companyList: this.companyList,
      ltcTypeInclude: this.ltcTypeInclude,
      ltcTypeExclude: this.ltcTypeExclude,
      department: this.department,
      seniority: this.seniority,
      cityList: this.cityList,
      stateList: this.stateList,
      searchType: this.searchType,
      offset: this.offset,
      limit: this.limit,
      savedListOffset: this.savedListOffset
    }
  }


  public fromJson(obj: any): SearchLTCModel {
    return new SearchLTCModel(
      obj.fullName,
      obj.titleInclude,
      obj.titleExclude,
      obj.company,
      obj.ltcTypeInclude,
      obj.ltcTypeExclude,
      obj.department,
      obj.seniority,
      obj.cityList,
      obj.stateList,
      obj.searchType,
      obj.offset,
      obj.limit,
      obj.savedListOffset
    )
  }

  validateLTCSearch() {
    return (
      this.fullNameList.length > 0 ||
      this.titleInclude.length > 0 ||
      this.titleExclude.length > 0 ||
      this.companyList.length > 0 ||
      this.ltcTypeInclude.length > 0 ||
      this.ltcTypeExclude.length > 0 ||
      this.department.length > 0 ||
      this.seniority.length > 0 ||
      this.cityList.length > 0 ||
      this.stateList.length > 0
    )
  }


  getChangedItems() {
    let changedItems = [];
    SearchLTCModel.titleKeyArray.map(item => {
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
    { key: 'ltcTypeInclude', title: 'Industry Include', type: 'array' },
    { key: 'ltcTypeExclude', title: 'Industry Exclude', type: 'array' },
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
  ]
}