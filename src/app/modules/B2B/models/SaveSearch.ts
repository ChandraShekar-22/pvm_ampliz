import { SearchCompanyInput } from "./SearchCompany";
import { SearchContactInput } from "./SearchContactModel";

export class SaveSearchInput {
    constructor(
        public searchName: string = '',
        public serachInput: SearchContactInput|SearchCompanyInput
    ) {}

    public toJson(): object {
        return {
            searchName: this.searchName,
            serachInput:this.serachInput
        }
    }

}