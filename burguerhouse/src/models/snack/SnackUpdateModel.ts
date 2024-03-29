import { SnackItemCreateUpdateModel } from '../snackItem/SnackItemCreateUpdateModel';

export class SnackUpdateModel {
    description: string;
    unitMoneyAmount: number;
    snackItems: SnackItemCreateUpdateModel[];

    constructor(_description: string, _snackItems: SnackItemCreateUpdateModel[], _unitMoneyAmount: number) {
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
    }
}
