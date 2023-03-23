import { data } from "jquery";

export class Imaging {
  constructor(
    public imagingCenterId: string = '',
    public centerName: string = '',
    public address: string = '',
    public phoneNumber: string = '',
    public web_Address: string = '',
    public noOfExecutive: number = 0,
    public state: string = '',
    public city: string = '',
    public country: string = ''
  ) { }

  public toJson(): object {
    return {
      imagingCenterId: this.imagingCenterId,
      centerName: this.centerName,
      address: this.address,
      phoneNumber: this.phoneNumber,
      web_Address: this.web_Address,
      noOfExecutive: this.noOfExecutive,
      state: this.state,
      city: this.city,
      country: this.country,

    }
  }


  public fromJson(obj: any): Imaging {
    return new Imaging(
      obj.imagingCenterId,
      obj.centerName,
      obj.address,
      obj.phoneNumber,
      obj.web_Address,
      obj.state,
      obj.city,
      obj.country,
    )
  }
}

export class ImagingList {
  constructor(public imagingCenterInfoList: Array<Imaging> = []) {
  }

  updateImagingssListFromSavedList(savedList: Array<Imaging>) {
    savedList.map((savedImaging: Imaging) => {
      const index = this.imagingCenterInfoList.findIndex(imagingItem => savedImaging.imagingCenterId == imagingItem.imagingCenterId);
      if (index !== -1) {
        this.imagingCenterInfoList[index] = savedImaging;
      }
    });
  }

  testData(): any[] {
    let data= [];
    for (let i=0;i<5;i++) {
      data.push(new Imaging('sdsdsd','Center1','address','9495929393','https://www.google.com',3,'CA','City','America'));
    }
    return data;
  }
  
}