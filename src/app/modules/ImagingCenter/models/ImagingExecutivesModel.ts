export class ImagingExecutive {
    constructor(
        public company: string='',
        public icExecutiveId: string='',
        public phoneNumber: Array<any>=[],
        public email: Array<any>=[],
        public facebook: string='',
        public fullName: string='',
        public imageUrl: string='',
        public inSavedList: boolean=false,
        public linkedinURL: string="",
        public industryList: Array<any>=[],
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
        icExecutiveId: this.icExecutiveId,
        directDialPhone: this.phoneNumber,
        email: this.email,
        facebook: this.facebook,
        fullName: this.fullName,
        imageUrl: this.imageUrl,
        inSavedList: this.inSavedList,
        linkedinURL: this.linkedinURL,
        industryList: this.industryList,
        location:this.location,
        skillList: this.skillList,
        title: this.title,
        twitterURL: this.twitterURL,
        state: this.state,
        city: this.city,
        country: this.country,
        }
      }


  public fromJson(obj: any): ImagingExecutive {
    return new ImagingExecutive(
        obj.company,
        obj.contactId,
        obj.directDialPhone,
        obj.email,
        obj.facebook,
        obj.fullName,
        obj.imageUrl,
        obj.inSavedList,
        obj.linkedinURL,
        obj.industryList,
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

export class ImagingExecutiveList {
    constructor(public imagingCenterExecutiveInfoList: Array<ImagingExecutive>=[]) {
    }

    updateImagingssListFromSavedList(savedList: Array<ImagingExecutive>) {
        savedList.map((savedImaging: ImagingExecutive) => {
                    const index = this.imagingCenterExecutiveInfoList.findIndex(imagingItem => savedImaging.icExecutiveId==imagingItem.icExecutiveId);
                    if(index !==-1) {
                        this.imagingCenterExecutiveInfoList[index] = savedImaging;
                    }
            });
    }

}