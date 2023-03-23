export class SearchCompanyInput {
  constructor(
    public offset: number = 0,
    public count: number = 25,
    public companyList: Array<any> = [],
    public domainList: Array<any> = [],
    public industryInclude: Array<any> = [],
    public industryExclude: Array<any> = [],
    public techInclude: Array<any> = [],
    public techExclude: Array<any> = [],
    // public employeeRange: string="",
    public employeeRangeList: Array<any> = [],
    public revenue: Array<any> = [],
    public countryList: Array<any> = [],
    public stateList: Array<any> = [],
    public cityList: Array<any> = [],
    public clientIp: string = ""
  ) {}

  public toJson(): object {
    return {
      offset: this.offset,
      count: this.count,
      companyList: this.companyList,
      domainList: this.domainList,
      industryInclude: this.industryInclude,
      industryExclude: this.industryExclude,
      techInclude: this.techInclude,
      techExclude: this.techExclude,
      // employeeRange: this.employeeRange,
      employeeRangeList: this.employeeRangeList,
      revenue: this.revenue,
      countryList: this.countryList,
      stateList: this.stateList,
      cityList: this.cityList,
      clientIp: this.clientIp,
    };
  }

  public fromJson(obj: any): SearchCompanyInput {
    return new SearchCompanyInput(
      obj.offset,
      obj.count,
      obj.companyList,
      obj.domainList,
      obj.industryInclude,
      obj.industryExclude,
      obj.techInclude,
      obj.techExclude,
      // obj.employeeRange,
      obj.employeeRangeList,
      obj.revenue,
      obj.countryList,
      obj.stateList,
      obj.cityList
    );
  }
  validateCompanySearch() {
    return (
      this.companyList.length > 0 ||
      this.domainList.length > 0 ||
      this.industryInclude.length > 0 ||
      this.industryExclude.length > 0 ||
      this.techInclude.length > 0 ||
      this.techExclude.length > 0 ||
      this.employeeRangeList.length > 0 ||
      this.revenue.length > 0 ||
      this.countryList.length > 0 ||
      this.stateList.length > 0 ||
      this.cityList.length > 0
    );
  }

  getChangedItems() {
    let changedItems = [];
    SearchCompanyInput.titleKeyArray.map((item) => {
      if (this[item.key].length > 0) {
        item["value"] = this[item.key];
        changedItems.push(item);
      }
    });
    return changedItems;
  }

  static titleKeyArray = [
    { key: "companyList", title: "Company List", type: "array" },
    { key: "industryInclude", title: "Industry Include", type: "array" },
    { key: "domainList", title: "Domain", type: "array" },
    { key: "industryExclude", title: "Industry Exclude", type: "array" },
    { key: "techInclude", title: "Tech Include", type: "array" },
    { key: "techExclude", title: "Tech Exclude", type: "array" },
    { key: "countryList", title: "Country List", type: "array" },
    { key: "stateList", title: "State List", type: "array" },
    { key: "cityList", title: "City List", type: "array" },
    { key: "revenue", title: "Revenue", type: "array" },
    { key: "employeeRangeList", title: "Employee Range", type: "array" },
  ];
}