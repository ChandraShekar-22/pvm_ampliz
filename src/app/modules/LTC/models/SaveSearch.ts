// import { SearchLTCModel } from "./SearchLTCModel";
import { SearchLTCModel } from "./SearchLTCModel";

export class SaveSearchInput {
    constructor(
        public searchName: string = '',
        public serachInput: SearchLTCModel
    ) {}

    public toJson(): object {
        return {
            searchName: this.searchName,
            serachInput:this.serachInput
        }
    }

}