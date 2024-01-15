export class IngredientCreateModel {
    name: string;
    unitMoneyAmount: number;
    availableAmount: number;

    constructor(_name: string, _unitMoneyAmount: number, _availableAmount: number) {
        this.name = _name;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.availableAmount = _availableAmount;
    }
}
