import { SnackItemResponseModel } from '../snackItem/SnackItemResponseModel';

export class SnackResponseModel {
    id: string;
    name: string;
    description: string;
    unitMoneyAmount: number;
    snackItems: SnackItemResponseModel[];

    constructor(
        _id: string,
        _name: string,
        _description: string,
        _snackItems: SnackItemResponseModel[],
        _unitMoneyAmount: number,
    ) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
    }
}
