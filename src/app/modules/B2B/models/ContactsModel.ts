export class Contact {
    constructor(
        public company: string='',
        public contactId: string='',
        public directDialPhone: Array<any>=[],
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
      ) {}

      public toJson(): object {
        return {
        company: this.company,
        contactId: this.contactId,
        directDialPhone: this.directDialPhone,
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
        twitterURL: this.twitterURL
        }
      }


  public fromJson(obj: any): Contact {
    return new Contact(
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
        obj.twitterURL
    )
  }
}

export class ContactsList {
    constructor(public contacts: Array<Contact>=[]) {
    }

    updateContactsListFromSavedList(savedList: Array<Contact>) {
      savedList.map((savedContact: Contact) => {
        const index = this.contacts.findIndex(
          (contactItem) => savedContact.contactId == contactItem.contactId
        );
        if (index !== -1) {
          this.contacts[index] = savedContact;
        }
      });
      // console.log(this.contacts);
    }

}