export class LTC {
    constructor(
        public company: string='',
        public ltcExecutiveId: string='',
        public phoneNumber: Array<any>=[],
        public email: Array<any>=[],
        public facebook: string='',
        public fullName: string='',
        public imageUrl: string='',
        public inSavedList: boolean=false,
        public linkedinURL: string="",
        public ltcTypeInclude: Array<any>=[],
        public location: string="",
        public skillList: Array<any>=[],
        public title: Array<any>=[],
        public twitterURL: string='',
        public state: string = '',
        public city: string = '',
        public country: string = ''
      ) {}

      public toJson(): object {
        return {
        company: this.company,
        icExecutiveId: this.ltcExecutiveId,
        directDialPhone: this.phoneNumber,
        email: this.email,
        facebook: this.facebook,
        fullName: this.fullName,
        imageUrl: this.imageUrl,
        inSavedList: this.inSavedList,
        linkedinURL: this.linkedinURL,
        industryList: this.ltcTypeInclude,
        location:this.location,
        skillList: this.skillList,
        title: this.title,
        twitterURL: this.twitterURL,
        state: this.state,
        city: this.city,
        country: this.country,
        }
      }


  public fromJson(obj: any): LTC {
    return new LTC(
        obj.company,
        obj.contactId,
        obj.directDialPhone,
        obj.email,
        obj.facebook,
        obj.fullName,
        obj.imageUrl,
        obj.inSavedList,
        obj.linkedinURL,
        obj.ltcTypeInclude,
        obj.location,
        obj.skillList,
        obj.title,
        obj.twitterURL,
        obj.state,
        obj.city,
        obj.country,
    )
  }
}

export class LTCList {
    constructor(public lTCInfoList: Array<LTC>=[]) {
    }

    updateLTCListFromSavedList(savedList: Array<LTC>) {
        savedList.map((savedLTC: LTC) => {
                    const index = this.lTCInfoList.findIndex(ltcItem => savedLTC.ltcExecutiveId==ltcItem.ltcExecutiveId);
                    if(index !==-1) {
                        this.lTCInfoList[index] = savedLTC;
                    }
            });
    }

}