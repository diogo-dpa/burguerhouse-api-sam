import { SnackItemCreateUpdateModel } from '../snackItem/SnackItemCreateUpdateModel';

export class SnackCreateModel {
    name: string;
    description: string;
    unitMoneyAmount: number;
    snackItems: SnackItemCreateUpdateModel[];

    constructor(
        _name: string,
        _description: string,
        _snackItems: SnackItemCreateUpdateModel[],
        _unitMoneyAmount: number,
    ) {
        this.name = _name;
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
    }
}
