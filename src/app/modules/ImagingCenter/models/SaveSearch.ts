// import { SearchImagingModel } from "./SearchImagingModel";
import { SearchImagingModel } from "./SearchImagingModel";

export class SaveSearchInput {
    constructor(
        public searchName: string = '',
        public serachInput: SearchImagingModel
    ) {}

    public toJson(): object {
        return {
            searchName: this.searchName,
            serachInput:this.serachInput
        }
    }

}